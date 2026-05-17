import { PayOS, PaymentRequests, Webhooks } from '@payos/node'
import Invoice from '@/models/invoice.js'
import Preference from '@/models/preference.js'
import Application from '@/models/application.js'
import NotificationService from '@/app/services/notification.service.js'
import { PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY, APP_URL_CLIENT } from '@/configs'

const payosClient = new PayOS(PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY)
const paymentRequests = new PaymentRequests(payosClient)
const webhooks = new Webhooks(payosClient)

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

    async _syncPendingInvoices(invoices) {
        const pending = invoices.filter(inv => inv.status === 'pending' && inv.orderCode)
        for (const inv of pending) {
            try {
                const info = await paymentRequests.get(inv.orderCode)
                if (info && info.status === 'PAID') {
                    const ref = (info.transactions && info.transactions.length > 0)
                        ? info.transactions[0].reference
                        : 'PAYOS_' + inv.orderCode
                    await Invoice.updateOne(
                        { _id: inv._id },
                        { $set: { status: 'paid', transactionId: ref } }
                    )
                    inv.status = 'paid'
                    inv.transactionId = ref
                } else if (info && info.status === 'CANCELLED') {
                    await Invoice.updateOne(
                        { _id: inv._id },
                        { $set: { status: 'cancelled' } }
                    )
                    inv.status = 'cancelled'
                }
            } catch (e) {
                // skip
            }
        }
        return invoices
    }

    async getInvoiceDetail(userId, roundId) {
        if (!roundId) throw new Error('Vui lòng chọn đợt xét tuyển')

        const invoice = await Invoice.findOne({ userId, round_id: roundId, isSubmitted: true })
            .populate('round_id', 'name code year')

        if (!invoice) {
            throw new Error('Vui lòng nộp hồ sơ trước khi thanh toán')
        }

        await this._syncPendingInvoices([invoice])
        await this._checkCanPay(userId)

        return invoice
    }

    async createPaymentLink(userId, roundId, clientReturnUrl) {
        if (!roundId) throw new Error('Vui lòng chọn đợt xét tuyển')

        const invoice = await Invoice.findOne({ userId, round_id: roundId, isSubmitted: true })
            .populate('round_id', 'name code year')

        if (!invoice) {
            throw new Error('Vui lòng nộp hồ sơ trước khi thanh toán')
        }

        await this._syncPendingInvoices([invoice])

        if (invoice.status === 'paid') {
            throw new Error('Hóa đơn này đã được thanh toán.')
        }

        await this._checkCanPay(userId)

        if (invoice.checkoutUrl && invoice.orderCode && invoice.status === 'pending') {
            try {
                const paymentInfo = await paymentRequests.get(invoice.orderCode)
                if (paymentInfo && paymentInfo.status === 'PENDING') {
                    return { checkoutUrl: invoice.checkoutUrl, invoice }
                }
            } catch (e) {
                // link cũ lỗi thì tạo link mới
            }
        }

        const orderCode = Date.now() % 1000000000

        const roundName = invoice.round_id?.name || 'Xet tuyen'
        const description = `Phi XT ${roundName}`.substring(0, 25)

        const paymentData = {
            orderCode,
            amount: Math.round(invoice.totalAmount),
            description,
            returnUrl: clientReturnUrl || `${APP_URL_CLIENT}/thanh-toan`,
            cancelUrl: clientReturnUrl || `${APP_URL_CLIENT}/thanh-toan`,
            items: [
                {
                    name: `Le phi xet tuyen - ${invoice.preferenceCount} nguyen vong`,
                    quantity: 1,
                    price: Math.round(invoice.totalAmount)
                }
            ]
        }

        const paymentLink = await paymentRequests.create(paymentData)

        invoice.orderCode = orderCode
        invoice.checkoutUrl = paymentLink.checkoutUrl
        invoice.paymentMethod = 'payos'
        await invoice.save()

        return { checkoutUrl: paymentLink.checkoutUrl, invoice }
    }

    async handlePaymentWebhook(webhookBody) {
        const webhookData = webhooks.verify(webhookBody)

        if (!webhookData || !webhookData.orderCode) {
            throw new Error('Webhook data không hợp lệ')
        }

        const { orderCode, code, desc } = webhookData

        const invoice = await Invoice.findOne({ orderCode })
        if (!invoice) return { success: true }

        if (invoice.status === 'paid') return { success: true }

        if (code === '00' && desc === 'success') {
            invoice.status = 'paid'
            invoice.transactionId = webhookData.reference || `PAYOS_${orderCode}`
            await invoice.save()

            await NotificationService.createAndPush(invoice.userId, {
                title: 'Thanh toán thành công',
                description: `Bạn đã thanh toán thành công lệ phí xét tuyển ${invoice.totalAmount.toLocaleString('vi-VN')}đ.`,
                type: 'success',
                metadata: { invoiceId: invoice._id.toString(), orderCode }
            }).catch(() => {})
        } else {
            invoice.status = 'cancelled'
            await invoice.save()
        }

        return { success: true }
    }

    async handlePaymentReturn(orderCode) {
        if (!orderCode) throw new Error('Thiếu mã đơn hàng')

        const invoice = await Invoice.findOne({ orderCode: Number(orderCode) })
            .populate('round_id', 'name code year')

        if (!invoice) throw new Error('Không tìm thấy hóa đơn')

        if (invoice.status === 'pending') {
            await this._syncPendingInvoices([invoice])
        }

        return invoice
    }

    async getPaymentStatus(userId, roundId) {
        const query = { userId }
        if (roundId) query.round_id = roundId

        const invoice = await Invoice.findOne(query).sort({ createdAt: -1 }).populate('round_id', 'name code year')
        if (!invoice) {
            return { status: 'unpaid', hasInvoice: false }
        }

        await this._syncPendingInvoices([invoice])

        return {
            status: invoice.status === 'paid' ? 'paid' : 'unpaid',
            hasInvoice: true,
            invoice
        }
    }

    async confirmPayment(userId, roundId) {
        if (!roundId) throw new Error('Vui lòng chọn đợt xét tuyển')

        const invoice = await Invoice.findOne({ userId, round_id: roundId, isSubmitted: true })
        if (!invoice) throw new Error('Vui lòng nộp hồ sơ trước khi thanh toán')
        if (invoice.status === 'paid') throw new Error('Hóa đơn này đã được thanh toán.')

        await this._checkCanPay(userId)

        invoice.status = 'paid'
        invoice.paymentMethod = invoice.paymentMethod || 'bank_transfer'
        invoice.transactionId = 'MANUAL_' + Date.now()
        await invoice.save()

        return invoice
    }

    async cancelPayment(userId, roundId) {
        if (!roundId) throw new Error('Vui lòng chọn đợt xét tuyển')

        const invoice = await Invoice.findOne({ userId, round_id: roundId, isSubmitted: true })
        if (!invoice) throw new Error('Không tìm thấy hóa đơn')
        if (invoice.status === 'paid') throw new Error('Không thể hủy hóa đơn đã thanh toán')

        if (invoice.orderCode) {
            try {
                await paymentRequests.cancel(invoice.orderCode)
            } catch (e) {
                // Link đã bị hủy hoặc hết hạn thì bỏ qua
            }
        }

        invoice.status = 'cancelled'
        invoice.checkoutUrl = ''
        await invoice.save()

        return invoice
    }

    async getPaymentHistory(userId) {
        const invoices = await Invoice.find({ userId })
            .populate('round_id', 'name code year')
            .sort({ createdAt: -1 })

        await this._syncPendingInvoices(invoices)

        return invoices
    }

    async getAllInvoices({ status, page = 1, limit = 20 } = {}) {
        const query = {}
        if (status) query.status = status

        const skip = (page - 1) * limit
        const [data, total] = await Promise.all([
            Invoice.find(query)
                .populate('userId', 'name email phone')
                .populate('round_id', 'name code year')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Invoice.countDocuments(query)
        ])

        await this._syncPendingInvoices(data)

        return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
    }

    async getInvoiceById(invoiceId) {
        const invoice = await Invoice.findById(invoiceId)
            .populate('userId', 'name email phone')
            .populate('round_id', 'name code year')

        if (!invoice) throw new Error('Không tìm thấy hóa đơn')

        await this._syncPendingInvoices([invoice])

        return invoice
    }

    async getPaymentStats() {
        // Sync tất cả pending invoices trước khi tính stats
        const pendingWithOrder = await Invoice.find({ status: 'pending', orderCode: { $ne: null } })
        await this._syncPendingInvoices(pendingWithOrder)

        const [totalInvoices, paidInvoices, pendingInvoices, cancelledInvoices, revenueResult] = await Promise.all([
            Invoice.countDocuments(),
            Invoice.countDocuments({ status: 'paid' }),
            Invoice.countDocuments({ status: 'pending' }),
            Invoice.countDocuments({ status: 'cancelled' }),
            Invoice.aggregate([
                { $match: { status: 'paid' } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } }
            ])
        ])

        return {
            totalInvoices,
            paidInvoices,
            pendingInvoices,
            cancelledInvoices,
            totalRevenue: revenueResult[0]?.total || 0
        }
    }
}

export default new PaymentService()
