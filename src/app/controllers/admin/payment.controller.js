import PaymentService from '@/app/services/payment.service.js'

export const getAllInvoices = async (req, res) => {
    try {
        const data = await PaymentService.getAllInvoices()

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
