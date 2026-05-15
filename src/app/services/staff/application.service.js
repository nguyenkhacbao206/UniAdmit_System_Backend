import Preference from '@/models/preference.js'
import User from '@/models/user.js'
import Score from '@/models/score.js'
import Profile from '@/models/profile.js'
import Invoice from '@/models/invoice.js'
import NotificationService from '@/app/services/notification.service.js'
import SupplementService from '@/app/services/staff/supplement.service.js'
import { Supplement } from '@/models/index.js'

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
            const prefFilter = { userId: user._id }
            if (status) prefFilter.status = status

            const preferences = await Preference.find(prefFilter)
                .populate('university major admissionMethod')
                .sort({ priority: 1 })

            if (status && preferences.length === 0) continue

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
            for (const pref of preferences) {
                const finalPoints = pref.points || bestPoints
                const finalComb = pref.combination || bestCombName
                const supplements = await Supplement.find({ preferenceId: pref._id }).sort({ createdAt: -1 })

                prefsWithDetails.push({
                    ...pref.toObject(),
                    points: finalPoints,
                    combination: finalComb,
                    supplements
                })
            }

            const allPrefs = status
                ? prefsWithDetails
                : await Preference.find({ userId: user._id })

            const statuses = (status ? prefsWithDetails : allPrefs).map((p) => p.status)
            let overallStatus = 'pending'
            if (statuses.every(s => s === 'approved')) overallStatus = 'approved'
            else if (statuses.every(s => s === 'rejected')) overallStatus = 'rejected'
            else if (statuses.some(s => s === 'approved')) overallStatus = 'partial_approved'
            else if (statuses.some(s => s === 'additional_required')) overallStatus = 'additional_required'

            allRows.push({
                _id: String(user._id),
                student: {
                    ...user.toObject(),
                    profile: profile?.toObject(),
                    score: score?.toObject()
                },
                preferenceCount: allPrefs.length,
                overallStatus,
                preferences: prefsWithDetails,
                submittedAt: preferences[0]?.submittedAt || preferences[0]?.createdAt
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
