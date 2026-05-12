import Invoice from '@/models/invoice.js'
import Preference from '@/models/preference.js'
import Application from '@/models/application.js'

class PaymentService {
    async getInvoiceDetail(userId) {
        // First check if there is a paid invoice
        const paidInvoice = await Invoice.findOne({ userId, status: 'paid' })
        if (paidInvoice) {
            return paidInvoice
        }

        // Count applications first, fall back to preferences
        const applicationCount = await Application.countDocuments({ user_id: userId })
        const preferenceCount = applicationCount > 0
            ? applicationCount
            : (await Preference.find({ userId })).length

        // If nothing registered, nothing to pay
        if (preferenceCount === 0) {
            throw new Error('Bạn chưa đăng ký nguyện vọng nào.')
        }

        // Calculate fees
        const FEE_PER_PREFERENCE = 20000
        const SERVICE_FEE = 20000

        const admissionFee = preferenceCount * FEE_PER_PREFERENCE
        const serviceFee = SERVICE_FEE
        const totalAmount = admissionFee + serviceFee

        // Find or create pending invoice
        let invoice = await Invoice.findOne({ userId, status: 'pending' })

        if (invoice) {
            // Update existing pending invoice if preference count changed
            if (invoice.preferenceCount !== preferenceCount) {
                invoice.preferenceCount = preferenceCount
                invoice.admissionFee = admissionFee
                invoice.serviceFee = serviceFee
                invoice.totalAmount = totalAmount
                await invoice.save()
            }
        } else {
            // Create new invoice
            invoice = await Invoice.create({
                userId,
                preferenceCount,
                admissionFee,
                serviceFee,
                totalAmount,
                status: 'pending'
            })
        }

        return invoice
    }

    async confirmPayment(userId, paymentMethod) {
        const invoice = await Invoice.findOne({ userId, status: 'pending' })

        if (!invoice) {
            // If already paid, don't throw error, just return the paid invoice
            const paidInvoice = await Invoice.findOne({ userId, status: 'paid' })
            if (paidInvoice) return paidInvoice
            
            throw new Error('Không tìm thấy hóa đơn chưa thanh toán.')
        }

        // Simulating successful payment
        invoice.status = 'paid'
        invoice.paymentMethod = paymentMethod || 'vnpay'
        invoice.transactionId = `TXN${new Date().getTime()}`
        await invoice.save()

        return invoice
    }

    async getPaymentStatus(userId) {
        const invoice = await Invoice.findOne({ userId }).sort({ createdAt: -1 })
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
            .sort({ createdAt: -1 })
    }
}

export default new PaymentService()

