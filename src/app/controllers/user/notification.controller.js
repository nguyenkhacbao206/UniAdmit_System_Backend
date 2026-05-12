import NotificationService from '@/app/services/notification.service.js'
import { addClient, removeClient } from '@/utils/sse.js'
import { tokenBlocklist } from '@/app/services/auth.service.js'
import { TOKEN_TYPE, SECRET_KEY } from '@/configs/index.js'
import jwt from 'jsonwebtoken'
import { User, Staff, Admin } from '@/models/index.js'

// GET /user/notifications
export const getNotifications = async (req, res) => {
    try {
        const userId = req.currentUser?._id || req.currentStaff?._id || req.currentAdmin?._id
        const { page = 1, limit = 20 } = req.query
        const data = await NotificationService.getNotifications(userId, {
            page: Number(page),
            limit: Number(limit)
        })
        res.json({ success: true, data })
    } catch (err) {
        res.status(400).json({ success: false, message: err.message })
    }
}


// PATCH /user/notifications/:id/read

export const markRead = async (req, res) => {
    try {
        const userId = req.currentUser?._id || req.currentStaff?._id || req.currentAdmin?._id
        const { id } = req.params
        const data = await NotificationService.markRead(userId, id)
        res.json({ success: true, data })
    } catch (err) {
        res.status(400).json({ success: false, message: err.message })
    }
}

// PATCH /user/notifications/read-all
export const markAllRead = async (req, res) => {
    try {
        const userId = req.currentUser?._id || req.currentStaff?._id || req.currentAdmin?._id
        await NotificationService.markAllRead(userId)
        res.json({ success: true, message: 'Đã đánh dấu tất cả là đã đọc' })
    } catch (err) {
        res.status(400).json({ success: false, message: err.message })
    }
}

// GET /user/notifications/sse
// Server-Sent Events endpoint — giữ kết nối và push real-time
// Hỗ trợ xác thực qua query string ?token=... (EventSource không thể gửi headers)

export const sseStream = async (req, res) => {
    let userId

    // Ưu tiên token từ query string (dùng cho SSE/EventSource)
    const queryToken = req.query.token
    if (queryToken) {
        try {
            const isAllowed = !(await tokenBlocklist.get(queryToken))
            if (!isAllowed) {
                return res.status(401).json({ success: false, message: 'Token không hợp lệ.' })
            }
            const payload = jwt.verify(queryToken, SECRET_KEY)

            if (payload.type === TOKEN_TYPE.USER_AUTHORIZATION) {
                const user = await User.findOne({ _id: payload.data.userId, deleted: false })
                if (user) userId = user._id
            } else if (payload.type === TOKEN_TYPE.STAFF_AUTHORIZATION) {
                const staff = await Staff.findOne({ _id: payload.data.staffId, deleted: false })
                if (staff) userId = staff._id
            } else if (payload.type === TOKEN_TYPE.ADMIN_AUTHORIZATION) {
                const admin = await Admin.findOne({ _id: payload.data.adminId, deleted: false })
                if (admin) userId = admin._id
            }
        } catch (e) {
            return res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn.' })
        }
    } else {
        // Fallback: token đã được inject bởi globalAuth middleware (cho các request thông thường)
        userId = req.currentUser?._id || req.currentStaff?._id || req.currentAdmin?._id
    }

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Yêu cầu đăng nhập.' })
    }

    // SSE headers
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.flushHeaders()

    // Gửi connected event
    res.write(`data: ${JSON.stringify({ event: 'connected', userId: String(userId) })}\n\n`)

    // Đăng ký client
    addClient(userId, res)

    // Heartbeat mỗi 25 giây để tránh timeout
    const heartbeat = setInterval(() => {
        res.write(': heartbeat\n\n')
    }, 25000)

    // Xử lý khi client ngắt kết nối
    req.on('close', () => {
        clearInterval(heartbeat)
        removeClient(userId)
    })
}
