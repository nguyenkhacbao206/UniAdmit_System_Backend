import Preference from '@/models/preference.js'
import User from '@/models/user.js'
import Score from '@/models/score.js'
import Profile from '@/models/profile.js'
import Invoice from '@/models/invoice.js'
import Application from '@/models/application.js'
import NotificationService from '@/app/services/notification.service.js'
import SupplementService from '@/app/services/staff/supplement.service.js'
import { Supplement } from '@/models/index.js'

// Map Application.status → Preference-shape status so the existing staff UI keeps working.
// Application enum: pending | verified | rejected | passed | failed
// Preference enum:  pending | processing | approved | rejected | additional_required
const mapApplicationStatusToPreference = (s) => {
    if (s === 'verified' || s === 'passed') return 'approved'
    if (s === 'rejected' || s === 'failed') return 'rejected'
    return 'pending'
}

// Unified shape: keep Application-native field names (which the FE Detail table reads)
// AND add Preference-style aliases so legacy display code keeps working.
const applicationToUnifiedShape = (app) => {
    const obj = (app.toObject && app.toObject()) || app
    const createdAt = obj.created_at || obj.createdAt
    return {
        _id: obj._id,
        // ── Application-native (FE Detail table columns read these) ─────────────
        user_id: obj.user_id,
        round_id: obj.round_id,
        university_id: obj.university_id,
        major_id: obj.major_id,
        aspiration_order: obj.aspiration_order,
        score: obj.score,
        method: obj.method || '',
        combination: obj.combination || '',
        // ── Preference-style aliases (legacy display, batch helpers) ───────────
        userId: obj.user_id,
        university: obj.university_id,
        major: obj.major_id,
        admissionMethod: null,
        priority: obj.aspiration_order,
        points: obj.score,
        // ── Status normalized to Preference enum so FE statusDisplayMap matches ─
        status: mapApplicationStatusToPreference(obj.status),
        // Keep raw Application status for debugging
        application_status: obj.status,
        // ── Timestamps & misc ──────────────────────────────────────────────────
        submittedAt: createdAt,
        createdAt,
        supplements: [],
        // Marks origin so staff.updateStatus dispatch works
        __source: 'application',
    }
}

class ApplicationService {
    async getList(query = {}) {
        const { page = 1, limit = 10, search, status, round_id } = query

        const invoiceFilter = { isSubmitted: true }
        if (round_id) invoiceFilter.round_id = round_id

        const submittedUserIds = await Invoice.distinct('userId', invoiceFilter)

        const userFilter = { _id: { $in: submittedUserIds }, deleted: false }
        if (search) {
            userFilter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        }

        const users = await User.find(userFilter).sort({ name: 1 })

        const allRows = []

        for (const user of users) {
            const profile = await Profile.findOne({ user_id: user._id })
            const score = await Score.findOne({ user_id: user._id })

            let bestPoints = 0
            let bestCombName = ''
            if (score && score.combinations && Object.keys(score.combinations).length > 0) {
                Object.entries(score.combinations).forEach(([comb, pts]) => {
                    if (Number(pts) > bestPoints) {
                        bestPoints = Number(pts)
                        bestCombName = comb
                    }
                })
            } else {
                bestPoints = score?.average || 0
            }

            const prefsWithDetails = []

            // PRIMARY source: Application (new flow). Always tied to a round.
            const appFilter = { user_id: user._id }
            if (round_id) appFilter.round_id = round_id
            const apps = await Application.find(appFilter)
                .populate('university_id major_id')
                .sort({ aspiration_order: 1 })

            for (const app of apps) {
                const shaped = applicationToUnifiedShape(app)
                if (status && shaped.status !== status) continue
                if (!shaped.score) shaped.score = bestPoints
                if (!shaped.points) shaped.points = shaped.score
                if (!shaped.combination) shaped.combination = bestCombName
                prefsWithDetails.push(shaped)
            }

            // LEGACY fallback: only when no round filter AND user has no Applications.
            // Preference has no `round` field, so it can't be filtered per round.
            // Using it under a round filter would surface unrelated old data ("auto-approve" bug).
            if (prefsWithDetails.length === 0 && !round_id) {
                const prefFilter = { userId: user._id }
                if (status) prefFilter.status = status

                const preferences = await Preference.find(prefFilter)
                    .populate('university major admissionMethod')
                    .sort({ priority: 1 })

                for (const pref of preferences) {
                    const supplements = await Supplement.find({ preferenceId: pref._id }).sort({ createdAt: -1 })
                    const obj = pref.toObject()
                    const points = obj.points || bestPoints
                    prefsWithDetails.push({
                        ...obj,
                        // Application-style aliases so FE Detail table renders the same columns
                        aspiration_order: obj.priority,
                        university_id: obj.university,
                        major_id: obj.major,
                        score: points,
                        method: obj.admissionMethod?.name || '',
                        points,
                        combination: obj.combination || bestCombName,
                        supplements,
                        __source: 'preference',
                    })
                }
            }

            // Skip user entirely if filtering by status and nothing matched
            if (status && prefsWithDetails.length === 0) continue

            const totalCount = prefsWithDetails.length

            const statuses = prefsWithDetails.map((p) => p.status)
            let overallStatus = 'pending'
            if (statuses.length === 0) {
                overallStatus = 'pending' // no data → NOT auto-approved
            } else if (statuses.every(s => s === 'approved')) {
                overallStatus = 'approved'
            } else if (statuses.every(s => s === 'rejected')) {
                overallStatus = 'rejected'
            } else if (statuses.some(s => s === 'approved')) {
                overallStatus = 'partial_approved'
            } else if (statuses.some(s => s === 'additional_required')) {
                overallStatus = 'additional_required'
            }

            allRows.push({
                _id: String(user._id),
                student: {
                    ...user.toObject(),
                    profile: profile?.toObject(),
                    score: score?.toObject()
                },
                preferenceCount: totalCount,
                overallStatus,
                preferences: prefsWithDetails,
                // Alias the same array under the name the FE Detail table expects
                aspirations: prefsWithDetails,
                submittedAt: prefsWithDetails[0]?.submittedAt,
            })
        }

        const total = allRows.length
        const paginatedList = allRows.slice((page - 1) * limit, page * limit)

        return {
            data: paginatedList,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit)
            }
        }
    }

    async updateStatus(id, status, message, staffId) {
        // Try Application first (new flow). If id matches an Application, update that.
        const application = await Application.findById(id)
        if (application) {
            const appStatus =
                status === 'approved' ? 'verified' :
                    status === 'rejected' ? 'rejected' :
                        status === 'additional_required' ? 'pending' : // Application has no 'additional_required'
                            status

            // For 'additional_required', also create a supplement request like the Preference flow
            if (status === 'additional_required') {
                await SupplementService.createRequest({
                    userId: application.user_id,
                    preferenceId: application._id,
                    type: 'Bổ sung thông tin hồ sơ',
                    content: message || 'Vui lòng bổ sung thông tin theo yêu cầu của nhà trường.',
                    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                }, staffId)
                return application
            }

            application.status = appStatus
            if (appStatus === 'verified' || appStatus === 'rejected') {
                application.verified_by = staffId
                application.verified_at = new Date()
                if (appStatus === 'rejected') application.rejection_reason = message || ''
            }
            await application.save()
            await application.populate('university_id major_id')

            const majorName = application.major_id?.name || 'Ngành đã đăng ký'
            const uniName = application.university_id?.name || 'Trường đã đăng ký'
            const notifMap = {
                verified: {
                    title: 'Hồ sơ đã được duyệt',
                    description: `Chúc mừng! Hồ sơ ngành ${majorName} - ${uniName} của bạn đã được duyệt thành công.`,
                    type: 'approved'
                },
                rejected: {
                    title: 'Hồ sơ bị từ chối',
                    description: message
                        ? `Hồ sơ ngành ${majorName} - ${uniName} bị từ chối. Lý do: ${message}`
                        : `Hồ sơ ngành ${majorName} - ${uniName} của bạn đã bị từ chối.`,
                    type: 'rejected'
                }
            }
            const notifPayload = notifMap[appStatus]
            if (notifPayload && application.user_id) {
                try {
                    await NotificationService.createAndPush(application.user_id, {
                        ...notifPayload,
                        metadata: {
                            applicationId: application._id,
                            majorName,
                            universityName: uniName,
                            status: appStatus
                        }
                    })
                } catch (notifErr) {
                    console.error('Notification send error:', notifErr.message)
                }
            }
            return application
        }

        // Fallback: legacy Preference flow
        const preference = await Preference.findByIdAndUpdate(id, { status }, { new: true })
            .populate('university major')

        if (!preference) throw new Error('Không tìm thấy hồ sơ')

        const userId = preference.userId
        const majorName = preference.major?.name || 'Ngành đã đăng ký'
        const uniName = preference.university?.name || 'Trường đã đăng ký'

        if (status === 'additional_required') {
            await SupplementService.createRequest({
                userId,
                preferenceId: preference._id,
                type: 'Bổ sung thông tin hồ sơ',
                content: message || 'Vui lòng bổ sung thông tin theo yêu cầu của nhà trường.',
                deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }, staffId)
            return preference
        }

        const notifMap = {
            approved: {
                title: 'Hồ sơ đã được duyệt',
                description: `Chúc mừng! Hồ sơ ngành ${majorName} - ${uniName} của bạn đã được duyệt thành công.`,
                type: 'approved'
            },
            rejected: {
                title: 'Hồ sơ bị từ chối',
                description: message
                    ? `Hồ sơ ngành ${majorName} - ${uniName} bị từ chối. Lý do: ${message}`
                    : `Hồ sơ ngành ${majorName} - ${uniName} của bạn đã bị từ chối.`,
                type: 'rejected'
            }
        }

        const notifPayload = notifMap[status]
        if (notifPayload && userId) {
            try {
                await NotificationService.createAndPush(userId, {
                    ...notifPayload,
                    metadata: {
                        preferenceId: preference._id,
                        applicationCode: preference.applicationCode,
                        majorName,
                        universityName: uniName,
                        status
                    }
                })
            } catch (notifErr) {
                console.error('Notification send error:', notifErr.message)
            }
        }

        return preference
    }
}

export default new ApplicationService()
