import Notification from '@/models/notification.js'
import { sendToUser } from '@/utils/sse.js'

class NotificationService {
    // Lấy danh sách thông báo của user
    async getNotifications(userId, { page = 1, limit = 20 } = {}) {
        const query = { userId }
        const total = await Notification.countDocuments(query)
        const unread = await Notification.countDocuments({ ...query, read: false })

        const result = await Notification.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)

        return { result, total, unread }
    }

    // Đánh dấu một thông báo là đã đọc
    async markRead(userId, notificationId) {
        return await Notification.findOneAndUpdate(
            { _id: notificationId, userId },
            { read: true },
            { new: true }
        )
    }

    // Đánh dấu tất cả thông báo của user là đã đọc
    async markAllRead(userId) {
        return await Notification.updateMany({ userId, read: false }, { read: true })
    }

    // Tạo thông báo mới và push SSE đến user ngay lập tức
    async createAndPush(userId, { title, description, type, metadata }) {
        const notification = await Notification.create({
            userId,
            title,
            description: description || '',
            type: type || 'system',
            metadata: metadata || {},
            read: false
        })

        // Push real-time qua SSE
        sendToUser(userId, {
            event: 'new_notification',
            notification: {
                _id: notification._id,
                title: notification.title,
                description: notification.description,
                type: notification.type,
                read: notification.read,
                createdAt: notification.createdAt,
                metadata: notification.metadata
            }
        })

        return notification
    }
}

export default new NotificationService()
