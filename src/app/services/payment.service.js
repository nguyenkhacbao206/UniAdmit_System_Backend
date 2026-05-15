import Invoice from '@/models/invoice.js'
import Preference from '@/models/preference.js'
import Application from '@/models/application.js'
import NotificationService from '@/app/services/notification.service.js'

class PaymentService {
    async _checkCanPay(userId) {
        const preferences = await Preference.find({ userId })
        if (preferences.length === 0) {
            throw new Error('Bạn chưa có nguyện vọng nào.')
        }

        const hasApproved = preferences.some(p => p.status === 'approved')
        if (!hasApproved) {
            await NotificationService.createAndPush(userId, {
                title: 'Chưa thể thanh toán',
                description: 'Hồ sơ của bạn chưa được duyệt. Vui lòng chờ staff xét duyệt hồ sơ trước khi thanh toán.',
                type: 'warning',
                metadata: { reason: 'preference_not_approved' }
            }).catch(() => {})
            throw new Error('Hồ sơ chưa được duyệt. Vui lòng chờ staff xét duyệt hồ sơ trước khi thanh toán.')
        }

        const applications = await Application.find({ user_id: userId })
        if (applications.length > 0) {
            const hasVerified = applications.some(a => a.status === 'verified')
            if (!hasVerified) {
                await NotificationService.createAndPush(userId, {
                    title: 'Chưa thể thanh toán',
                    description: 'Hồ sơ xét tuyển của bạn chưa được xác minh. Vui lòng chờ staff xác minh trước khi thanh toán.',
                    type: 'warning',
                    metadata: { reason: 'application_not_verified' }
                }).catch(() => {})
                throw new Error('Hồ sơ xét tuyển chưa được xác minh. Vui lòng chờ staff xác minh trước khi thanh toán.')
            }
        }
    }

    async getInvoiceDetail(userId, roundId) {
        if (!roundId) throw new Error('Vui lòng chọn đợt xét tuyển')

        const invoice = await Invoice.findOne({ userId, round_id: roundId, isSubmitted: true })
            .populate('round_id', 'name code year')

        if (!invoice) {
            throw new Error('Vui lòng nộp hồ sơ trước khi thanh toán')
        }

        await this._checkCanPay(userId)

        return invoice
    }

    async confirmPayment(userId, paymentMethod, roundId) {
        if (!roundId) throw new Error('Vui lòng chọn đợt xét tuyển')

        const invoice = await Invoice.findOne({ userId, round_id: roundId, isSubmitted: true })

        if (!invoice) {
            throw new Error('Vui lòng nộp hồ sơ trước khi thanh toán')
        }

        if (invoice.status === 'paid') return invoice

        await this._checkCanPay(userId)

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
