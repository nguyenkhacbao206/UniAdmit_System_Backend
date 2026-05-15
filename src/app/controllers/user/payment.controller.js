import PaymentService from '@/app/services/payment.service.js'

export const getInvoice = async (req, res) => {
    try {
        const userId = req.currentUser._id
        const { round_id } = req.query

        const data = await PaymentService.getInvoiceDetail(userId, round_id)

        res.json({
            success: true,
            data
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

export const createPaymentLink = async (req, res) => {
    try {
        const userId = req.currentUser._id
        const { round_id, returnUrl } = req.body

        const data = await PaymentService.createPaymentLink(userId, round_id, returnUrl)

        res.json({
            success: true,
            data
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

export const handlePaymentReturn = async (req, res) => {
    try {
        const { orderCode } = req.query

        const data = await PaymentService.handlePaymentReturn(orderCode)

        res.json({
            success: true,
            data
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

export const getStatus = async (req, res) => {
    try {
        const userId = req.currentUser._id
        const { round_id } = req.query

        const data = await PaymentService.getPaymentStatus(userId, round_id)

        res.json({
            success: true,
            data
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

export const confirmPayment = async (req, res) => {
    try {
        const userId = req.currentUser._id
        const { round_id } = req.body

        const data = await PaymentService.confirmPayment(userId, round_id)

        res.json({
            success: true,
            message: 'Thanh toán thành công',
            data
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

export const cancelPayment = async (req, res) => {
    try {
        const userId = req.currentUser._id
        const { round_id } = req.body

        const data = await PaymentService.cancelPayment(userId, round_id)

        res.json({
            success: true,
            message: 'Đã hủy thanh toán',
            data
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

export const getPaymentHistory = async (req, res) => {
    try {
        const userId = req.currentUser._id
        const data = await PaymentService.getPaymentHistory(userId)

        res.json({
            success: true,
            data
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

export const handleWebhook = async (req, res) => {
    try {
        const result = await PaymentService.handlePaymentWebhook(req.body)
        res.json(result)
    } catch (err) {
        res.json({ success: true })
    }
}
