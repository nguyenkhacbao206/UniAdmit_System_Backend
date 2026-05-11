import Preference from '@/models/preference.js'
import User from '@/models/user.js'
import Score from '@/models/score.js'
import Profile from '@/models/profile.js'
import AdmissionMethod from '@/models/admission-method.js'
import NotificationService from '@/app/services/notification.service.js'

class ApplicationService {
    async getList(query = {}) {
        const { page = 1, limit = 10, search, status, admissionMethod } = query

        // Search logic for users who have submitted
        const userFilter = { isSubmitted: true }
        if (search) {
            userFilter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        }

        // Fetch submitted users
        const users = await User.find(userFilter).sort({ name: 1 })

        const allRows = []

        for (const user of users) {
            const prefFilter = { userId: user._id }
            if (status) prefFilter.status = status
            
            if (admissionMethod && admissionMethod !== 'Tất cả phương thức') {
                // Find admission method ID by name or code if not an ID
                const am = await AdmissionMethod.findOne({
                    $or: [
                        { code: admissionMethod },
                        { methodName: admissionMethod }
                    ]
                })
                if (am) {
                    prefFilter.admissionMethod = am._id
                } else {
                    // If method not found, this user won't have matching preferences
                    continue
                }
            }

            const preferences = await Preference.find(prefFilter)
                .populate('university major admissionMethod')
                .sort({ priority: 1 })

            // Get complete profile and score data
            const profile = await Profile.findOne({ user_id: user._id })
            const score = await Score.findOne({ user_id: user._id })

            // Calculate best score if not stored in preference (for legacy records)
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

            preferences.forEach(pref => {
                const finalPoints = pref.points || bestPoints
                const finalComb = pref.combination || bestCombName

                allRows.push({
                    ...pref.toObject(),
                    points: finalPoints,
                    combination: finalComb,
                    student: { 
                        ...user.toObject(),
                        profile: profile?.toObject(),
                        score: score?.toObject()
                    },
                    submittedAt: pref.submittedAt || pref.createdAt
                })
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

    async updateStatus(id, status, message) {
        const preference = await Preference.findByIdAndUpdate(id, { status }, { new: true })
            .populate('university major')

        if (!preference) throw new Error('Không tìm thấy hồ sơ')

        // Gửi thông báo real-time theo loại trạng thái
        const userId = preference.userId
        const majorName = preference.major?.name || 'Ngành đã đăng ký'
        const uniName = preference.university?.name || 'Trường đã đăng ký'

        const notifMap = {
            additional_required: {
                title: '📋 Yêu cầu bổ sung thông tin hồ sơ',
                description: message
                    ? `Hồ sơ ngành ${majorName} - ${uniName} cần bổ sung: ${message}`
                    : `Hồ sơ ngành ${majorName} - ${uniName} cần bổ sung thông tin. Vui lòng kiểm tra và cập nhật.`,
                type: 'additional_required'
            },
            approved: {
                title: '✅ Hồ sơ đã được duyệt',
                description: `Chúc mừng! Hồ sơ ngành ${majorName} - ${uniName} của bạn đã được duyệt thành công.`,
                type: 'approved'
            },
            rejected: {
                title: '❌ Hồ sơ bị từ chối',
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
                // Không throw lỗi notification, vẫn cập nhật status thành công
                console.error('Notification send error:', notifErr.message)
            }
        }

        return preference
    }
}

export default new ApplicationService()
