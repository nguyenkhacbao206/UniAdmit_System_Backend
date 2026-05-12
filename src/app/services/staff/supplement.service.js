import { Supplement, Preference, User } from '@/models/index.js'
import NotificationService from '@/app/services/notification.service.js'

class SupplementService {
    // Lấy danh sách yêu cầu bổ sung cho Staff
    async getList(query = {}) {
        const { page = 1, limit = 10, status, type } = query
        const filter = {}

        if (status) filter.status = status
        if (type) filter.type = type

        const total = await Supplement.countDocuments(filter)
        const result = await Supplement.find(filter)
            .populate('userId', 'name email phone')
            .populate({
                path: 'preferenceId',
                populate: { path: 'university major' }
            })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit))

        return { result, total }
    }

    // Tạo yêu cầu bổ sung mới
    async createRequest(data, staffId) {
        const { userId, preferenceId, type, content, deadline } = data

        // Phát sinh mã yêu cầu tự động SUP + timestamp
        const code = `SUP${Date.now().toString().slice(-6)}`

        const supplement = await Supplement.create({
            userId,
            staffId,
            preferenceId,
            code,
            type,
            content,
            deadline,
            status: 'pending'
        })

        // Cập nhật trạng thái nguyện vọng sang additional_required
        await Preference.findByIdAndUpdate(preferenceId, { status: 'additional_required' })

        // Gửi thông báo cho thí sinh
        await NotificationService.createAndPush(userId, {
            title: '📋 Yêu cầu bổ sung hồ sơ',
            description: `Yêu cầu bổ sung: ${type}. Nội dung: ${content}`,
            type: 'additional_required',
            metadata: { supplementId: supplement._id, preferenceId }
        })

        return supplement
    }

    // Staff phê duyệt hoặc từ chối phản hồi của User
    async handleAction(id, action, message) {
        const supplement = await Supplement.findById(id)
        if (!supplement) throw new Error('Không tìm thấy yêu cầu bổ sung')

        if (action === 'approve') {
            supplement.status = 'approved'
            if (supplement.preferenceId) {
                await Preference.findByIdAndUpdate(supplement.preferenceId, { status: 'approved' })
            }
        } else if (action === 'reject') {
            supplement.status = 'rejected'
        }

        await supplement.save()

        // Gửi thông báo kết quả cho User
        const title = action === 'approve' ? '✅ Bổ sung hồ sơ được chấp nhận' : '❌ Bổ sung hồ sơ bị từ chối'
        const description = action === 'approve' 
            ? `Yêu cầu ${supplement.code} đã được phê duyệt.`
            : `Yêu cầu ${supplement.code} bị từ chối. Lý do: ${message}`

        await NotificationService.createAndPush(supplement.userId, {
            title,
            description,
            type: action === 'approve' ? 'approved' : 'rejected',
            metadata: { supplementId: supplement._id }
        })

        return supplement
    }

    // Lấy danh sách yêu cầu bổ sung của thí sinh
    async getUserRequests(userId) {
        return await Supplement.find({ userId })
            .populate({
                path: 'preferenceId',
                populate: { path: 'university major' }
            })
            .sort({ createdAt: -1 })
    }

    // Thí sinh gửi phản hồi bổ sung hồ sơ
    async submitResponse(id, userId, data) {
        const { userFeedback, attachments } = data
        const supplement = await Supplement.findOne({ _id: id, userId })
        
        if (!supplement) throw new Error('Không tìm thấy yêu cầu bổ sung')
        if (supplement.status === 'approved') throw new Error('Yêu cầu đã được phê duyệt, không thể chỉnh sửa')

        supplement.userFeedback = userFeedback
        supplement.attachments = attachments || []
        supplement.status = 'submitted'
        supplement.resubmittedAt = new Date()

        await supplement.save()

        // Gửi thông báo cho Staff để họ biết User đã nộp lại minh chứng
        if (supplement.staffId) {
            const user = await User.findById(userId)
            await NotificationService.createAndPush(supplement.staffId, {
                title: '📩 Có phản hồi bổ sung mới',
                description: `Thí sinh ${user?.name || 'User'} đã nộp lại minh chứng cho yêu cầu ${supplement.code}`,
                type: 'submitted',
                metadata: { supplementId: supplement._id }
            })
        }

        return supplement
    }
}

export default new SupplementService()
