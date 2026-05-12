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

export const confirmPayment = async (req, res) => {
    try {
        const userId = req.currentUser._id
        const { paymentMethod, round_id } = req.body

        const data = await PaymentService.confirmPayment(userId, paymentMethod, round_id)

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
