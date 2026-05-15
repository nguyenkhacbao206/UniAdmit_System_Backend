import PaymentService from '@/app/services/payment.service.js'

export const getAllInvoices = async (req, res) => {
    try {
        const { status, page, limit } = req.query
        const data = await PaymentService.getAllInvoices({
            status,
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 20
        })

        res.json({
            success: true,
            ...data
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

export const getInvoiceDetail = async (req, res) => {
    try {
        const data = await PaymentService.getInvoiceById(req.params.id)

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

export const getPaymentStats = async (req, res) => {
    try {
        const data = await PaymentService.getPaymentStats()

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
