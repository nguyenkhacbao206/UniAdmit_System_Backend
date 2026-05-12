import Invoice from '@/models/invoice.js'

class PaymentService {
    async getInvoiceDetail(userId, roundId) {
        if (!roundId) throw new Error('Vui lòng chọn đợt xét tuyển')

        const invoice = await Invoice.findOne({ userId, round_id: roundId, isSubmitted: true })
            .populate('round_id', 'name code year')

        if (!invoice) {
            throw new Error('Vui lòng nộp hồ sơ trước khi thanh toán')
        }

        return invoice
    }

    async confirmPayment(userId, paymentMethod, roundId) {
        if (!roundId) throw new Error('Vui lòng chọn đợt xét tuyển')

        const invoice = await Invoice.findOne({ userId, round_id: roundId, isSubmitted: true })

        if (!invoice) {
            throw new Error('Vui lòng nộp hồ sơ trước khi thanh toán')
        }

        if (invoice.status === 'paid') return invoice

        invoice.status = 'paid'
        invoice.paymentMethod = paymentMethod || 'vnpay'
        invoice.transactionId = `TXN${new Date().getTime()}`
        await invoice.save()

        return invoice
    }

    async getPaymentStatus(userId, roundId) {
        const query = { userId }
        if (roundId) query.round_id = roundId

        const invoice = await Invoice.findOne(query).sort({ createdAt: -1 }).populate('round_id', 'name code year')
        if (!invoice) {
            return {
                status: 'unpaid',
                hasInvoice: false
            }
        }

        return {
            status: invoice.status === 'paid' ? 'paid' : 'unpaid',
            hasInvoice: true,
            invoice
        }
    }

    async getAllInvoices() {
        return await Invoice.find()
            .populate('userId', 'name email phone')
            .populate('round_id', 'name code year')
            .sort({ createdAt: -1 })
    }
}

export default new PaymentService()
