import mongoose from 'mongoose'
import Application from '@/models/application.js'
import User from '@/models/user.js'
import Profile from '@/models/profile.js'
import Score from '@/models/score.js'
import NotificationService from '@/app/services/notification.service.js'

class StaffAdmissionService {
    async getList(query = {}) {
        const { page = 1, limit = 10, search, status, round_id } = query

        const appFilter = {}
        if (round_id) appFilter.round_id = round_id
        if (status) appFilter.status = status

        if (search) {
            const users = await User.find({
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            }).select('_id')
            appFilter.user_id = { $in: users.map(u => u._id) }
        }

        const totalCount = await Application.countDocuments(appFilter)

        const apps = await Application.find(appFilter)
            .populate('university_id major_id round_id verified_by')
            .sort({ aspiration_order: 1 })
            .skip((page - 1) * limit)
            .limit(Number(limit))

        const userIds = [...new Set(apps.map(a => String(a.user_id)))]

        const [users, profiles, scores] = await Promise.all([
            User.find({ _id: { $in: userIds } }).select('-password -otp -otp_expired_at'),
            Profile.find({ user_id: { $in: userIds } }),
            Score.find({ user_id: { $in: userIds } })
        ])

        const userMap = {}
        for (const u of users) userMap[String(u._id)] = u
        const profileMap = {}
        for (const p of profiles) profileMap[String(p.user_id)] = p
        const scoreMap = {}
        for (const s of scores) scoreMap[String(s.user_id)] = s

        const roundMatch = round_id
            ? { round_id: new mongoose.Types.ObjectId(round_id) }
            : {}
        const countByUser = await Application.aggregate([
            { $match: roundMatch },
            { $group: { _id: '$user_id', count: { $sum: 1 } } }
        ])
        const countMap = {}
        for (const c of countByUser) countMap[String(c._id)] = c.count

        const data = apps.map(app => {
            const uid = String(app.user_id)
            const user = userMap[uid]
            const profile = profileMap[uid]
            const score = scoreMap[uid]

            return {
                ...app.toObject(),
                applicationCount: countMap[uid] || 1,
                student: user ? {
                    ...user.toObject(),
                    profile: profile?.toObject(),
                    score: score?.toObject()
                } : null
            }
        })

        return {
            data,
            pagination: {
                total: totalCount,
                page: Number(page),
                limit: Number(limit)
            }
        }
    }

    async verifyApplication(id, staffId) {
        const application = await Application.findById(id)
            .populate('major_id university_id')

        if (!application) throw new Error('Không tìm thấy hồ sơ')

        if (application.status !== 'pending') {
            throw new Error('Chỉ có thể xác minh hồ sơ ở trạng thái chờ duyệt')
        }

        application.status = 'verified'
        application.verified_by = staffId
        application.verified_at = new Date()
        await application.save()

        const majorName = application.major_id?.name || 'Ngành đã đăng ký'
        const uniName = application.university_id?.name || 'Trường đã đăng ký'

        await NotificationService.createAndPush(application.user_id, {
            title: 'Hồ sơ đã được xác minh',
            description: `Hồ sơ ngành ${majorName} - ${uniName} của bạn đã được xác minh thành công.`,
            type: 'approved',
            metadata: {
                applicationId: application._id,
                majorName,
                universityName: uniName,
                status: 'verified'
            }
        }).catch(err => console.error('Notification error:', err.message))

        return application
    }

    async rejectApplication(id, staffId, reason) {
        const application = await Application.findById(id)
            .populate('major_id university_id')

        if (!application) throw new Error('Không tìm thấy hồ sơ')

        if (application.status !== 'pending') {
            throw new Error('Chỉ có thể từ chối hồ sơ ở trạng thái chờ duyệt')
        }

        application.status = 'rejected'
        application.rejection_reason = reason || ''
        application.verified_by = staffId
        application.verified_at = new Date()
        await application.save()

        const majorName = application.major_id?.name || 'Ngành đã đăng ký'
        const uniName = application.university_id?.name || 'Trường đã đăng ký'

        await NotificationService.createAndPush(application.user_id, {
            title: 'Hồ sơ bị từ chối',
            description: reason
                ? `Hồ sơ ngành ${majorName} - ${uniName} bị từ chối. Lý do: ${reason}`
                : `Hồ sơ ngành ${majorName} - ${uniName} của bạn đã bị từ chối.`,
            type: 'rejected',
            metadata: {
                applicationId: application._id,
                majorName,
                universityName: uniName,
                status: 'rejected',
                reason
            }
        }).catch(err => console.error('Notification error:', err.message))

        return application
    }
}

export default new StaffAdmissionService()
