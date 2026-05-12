import mongoose from 'mongoose'
import Application from '@/models/application.js'
import Round from '@/models/round.js'
import Major from '@/models/major.js'
import AdmissionResult from '@/models/admission-result.js'
import NotificationService from '@/app/services/notification.service.js'

class AdmissionService {
    async runAdmission(roundId) {
        const round = await Round.findById(roundId)
        if (!round) throw new Error('Không tìm thấy đợt tuyển sinh')
        if (round.status !== 'closed') {
            throw new Error('Đợt tuyển sinh phải ở trạng thái "closed" mới có thể chạy xét tuyển')
        }

        round.status = 'processing'
        await round.save()

        try {
            await AdmissionResult.deleteMany({ round_id: roundId })
            await Application.updateMany(
                { round_id: roundId, status: { $in: ['passed', 'failed'] } },
                { status: 'verified' }
            )

            const verifiedApps = await Application.find({ round_id: roundId, status: 'verified' })

            const majorIds = [...new Set(verifiedApps.map(app => app.major_id.toString()))]
            const majors = await Major.find({ _id: { $in: majorIds } })
            const majorMap = {}
            for (const m of majors) {
                majorMap[m._id.toString()] = m
            }

            const maxAspiration = verifiedApps.reduce((max, app) => Math.max(max, app.aspiration_order), 0)
            const admittedUsers = new Set()
            const majorQuotaUsed = {}

            for (let aspOrder = 1; aspOrder <= maxAspiration; aspOrder++) {
                const appsAtLevel = verifiedApps.filter(
                    app => app.aspiration_order === aspOrder && !admittedUsers.has(app.user_id.toString())
                )

                const groupedByMajor = {}
                for (const app of appsAtLevel) {
                    const majorKey = app.major_id.toString()
                    if (!groupedByMajor[majorKey]) groupedByMajor[majorKey] = []
                    groupedByMajor[majorKey].push(app)
                }

                for (const [majorId, apps] of Object.entries(groupedByMajor)) {
                    const major = majorMap[majorId]
                    if (!major) continue

                    const quota = major.quota || 0
                    const minimumScore = major.minimum_score || 0
                    const used = majorQuotaUsed[majorId] || 0
                    const remainingQuota = quota - used

                    if (remainingQuota <= 0) continue

                    const eligible = apps
                        .filter(app => app.score >= minimumScore)
                        .sort((a, b) => {
                            if (b.score !== a.score) return b.score - a.score
                            return a.aspiration_order - b.aspiration_order
                        })

                    const toAdmit = eligible.slice(0, remainingQuota)

                    for (const app of toAdmit) {
                        app.status = 'passed'
                        await app.save()
                        admittedUsers.add(app.user_id.toString())
                        majorQuotaUsed[majorId] = (majorQuotaUsed[majorId] || 0) + 1
                    }
                }
            }

            for (const app of verifiedApps) {
                if (admittedUsers.has(app.user_id.toString())) {
                    if (app.status !== 'passed') {
                        app.status = 'failed'
                        await app.save()
                    }
                } else {
                    if (app.status === 'verified') {
                        app.status = 'failed'
                        await app.save()
                    }
                }
            }

            const resultStats = []
            for (const majorId of majorIds) {
                const major = majorMap[majorId]
                if (!major) continue

                const allAppsForMajor = verifiedApps.filter(a => a.major_id.toString() === majorId)
                const passedApps = allAppsForMajor.filter(a => a.status === 'passed')
                const passedScores = passedApps.map(a => a.score).sort((a, b) => a - b)
                const cutoffScore = passedScores.length > 0 ? passedScores[0] : 0

                const result = await AdmissionResult.create({
                    round_id: roundId,
                    major_id: majorId,
                    university_id: major.university_id,
                    total_applications: allAppsForMajor.length,
                    total_passed: passedApps.length,
                    cutoff_score: cutoffScore,
                    quota: major.quota || 0,
                    minimum_score: major.minimum_score || 0,
                    status: 'draft'
                })

                resultStats.push(result)
            }

            return {
                round,
                totalProcessed: verifiedApps.length,
                totalAdmitted: admittedUsers.size,
                resultsByMajor: resultStats
            }
        } catch (err) {
            round.status = 'closed'
            await round.save()
            throw err
        }
    }

    async publishResult(roundId, adminId) {
        const round = await Round.findById(roundId)
        if (!round) throw new Error('Không tìm thấy đợt tuyển sinh')
        if (round.status !== 'processing') {
            throw new Error('Cần chạy xét tuyển trước khi công bố kết quả')
        }

        const results = await AdmissionResult.find({ round_id: roundId })
        if (results.length === 0) {
            throw new Error('Chưa có kết quả xét tuyển, vui lòng chạy xét tuyển trước')
        }

        await AdmissionResult.updateMany(
            { round_id: roundId },
            { status: 'published', published_at: new Date(), published_by: adminId }
        )

        round.status = 'result_published'
        await round.save()

        const applications = await Application.find({
            round_id: roundId,
            status: { $in: ['passed', 'failed'] }
        }).populate('major_id university_id')

        const notifiedUsers = new Set()
        for (const app of applications) {
            const userKey = app.user_id.toString()
            if (notifiedUsers.has(userKey)) continue
            notifiedUsers.add(userKey)

            const majorName = app.major_id?.name || 'Ngành đã đăng ký'
            const uniName = app.university_id?.name || 'Trường đã đăng ký'

            if (app.status === 'passed') {
                await NotificationService.createAndPush(app.user_id, {
                    title: 'Kết quả xét tuyển đã được công bố',
                    description: `Chúc mừng! Bạn đã trúng tuyển ngành ${majorName} - ${uniName}. Vui lòng xác nhận nhập học.`,
                    type: 'approved',
                    metadata: {
                        roundId,
                        applicationId: app._id,
                        majorName,
                        universityName: uniName,
                        status: 'passed'
                    }
                }).catch(err => console.error('Notification error:', err.message))
            } else {
                await NotificationService.createAndPush(app.user_id, {
                    title: 'Kết quả xét tuyển đã được công bố',
                    description: `Rất tiếc, bạn chưa trúng tuyển trong đợt xét tuyển ${round.name}. Hãy theo dõi các đợt xét tuyển tiếp theo.`,
                    type: 'rejected',
                    metadata: {
                        roundId,
                        status: 'failed'
                    }
                }).catch(err => console.error('Notification error:', err.message))
            }
        }

        return {
            round,
            totalNotified: notifiedUsers.size,
            results: await AdmissionResult.find({ round_id: roundId })
                .populate('major_id university_id')
        }
    }

    async getStatistics(roundId) {
        const round = await Round.findById(roundId)
        if (!round) throw new Error('Không tìm thấy đợt tuyển sinh')

        const results = await AdmissionResult.find({ round_id: roundId })
            .populate('major_id university_id')

        const totalApplications = await Application.countDocuments({ round_id: roundId })
        const statusCounts = await Application.aggregate([
            { $match: { round_id: new mongoose.Types.ObjectId(roundId) } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ])

        const statusMap = {}
        for (const s of statusCounts) {
            statusMap[s._id] = s.count
        }

        const totalConfirmed = await Application.countDocuments({
            round_id: roundId,
            is_confirmed: true
        })

        return {
            round,
            totalApplications,
            statusSummary: {
                pending: statusMap.pending || 0,
                verified: statusMap.verified || 0,
                rejected: statusMap.rejected || 0,
                passed: statusMap.passed || 0,
                failed: statusMap.failed || 0
            },
            totalConfirmed,
            resultsByMajor: results
        }
    }
}

export default new AdmissionService()
