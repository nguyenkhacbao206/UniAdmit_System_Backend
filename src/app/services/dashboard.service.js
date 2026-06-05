import mongoose from 'mongoose'
import User from '@/models/user.js'
import Staff from '@/models/staff.js'
import Application from '@/models/application.js'
import Invoice from '@/models/invoice.js'
import Round from '@/models/round.js'

const MONTH_LABELS = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12']

const startOfMonth = (date) => {
    const d = new Date(date)
    d.setDate(1)
    d.setHours(0, 0, 0, 0)
    return d
}

const addMonths = (date, months) => {
    const d = new Date(date)
    d.setMonth(d.getMonth() + months)
    return d
}

const safePercent = (numerator, denominator) => {
    if (!denominator) return 0
    return Math.round((numerator / denominator) * 100)
}

const formatRelativeTime = (date) => {
    if (!date) return ''
    const now = Date.now()
    const t = new Date(date).getTime()
    const diff = Math.max(0, now - t)
    const sec = Math.floor(diff / 1000)
    if (sec < 60) return `${sec} giây trước`
    const min = Math.floor(sec / 60)
    if (min < 60) return `${min} phút trước`
    const hour = Math.floor(min / 60)
    if (hour < 24) return `${hour} giờ trước`
    const day = Math.floor(hour / 24)
    if (day < 30) return `${day} ngày trước`
    const month = Math.floor(day / 30)
    if (month < 12) return `${month} tháng trước`
    const year = Math.floor(month / 12)
    return `${year} năm trước`
}

class DashboardService {
    // ── STATS ───────────────────────────────────────────────────────────────
    async getStats() {
        const now = new Date()
        const startThisMonth = startOfMonth(now)
        const startPrevMonth = addMonths(startThisMonth, -1)

        const [
            staffCount,
            applicationCount,
            verifiedCount,
            totalUsers,
            usersThisMonth,
            usersPrevMonth,
            paidInvoiceCount,
            totalRevenueAgg,
        ] = await Promise.all([
            Staff.countDocuments({ deleted: false }),
            Application.countDocuments({}),
            Application.countDocuments({ status: { $in: ['verified', 'passed'] } }),
            User.countDocuments({ deleted: false }),
            User.countDocuments({ deleted: false, created_at: { $gte: startThisMonth } }),
            User.countDocuments({
                deleted: false,
                created_at: { $gte: startPrevMonth, $lt: startThisMonth },
            }),
            Invoice.countDocuments({ status: 'paid' }),
            Invoice.aggregate([
                { $match: { status: 'paid' } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } },
            ]),
        ])

        const usersDeltaPercent = usersPrevMonth
            ? Math.round(((usersThisMonth - usersPrevMonth) / usersPrevMonth) * 100)
            : usersThisMonth > 0
                ? 100
                : 0

        return {
            staffCount,
            applicationCount,
            verifiedCount,
            verifyRate: safePercent(verifiedCount, applicationCount),
            totalUsers,
            usersDeltaPercent,
            paidInvoiceCount,
            totalRevenue: totalRevenueAgg[0]?.total || 0,
        }
    }

    // ── TREND: applications created per month (last 7 months including current) ─
    async getRegistrationTrend(monthsBack = 7) {
        const now = new Date()
        const start = startOfMonth(addMonths(now, -(monthsBack - 1)))

        const aggregated = await Application.aggregate([
            { $match: { created_at: { $gte: start } } },
            {
                $group: {
                    _id: {
                        year: { $year: '$created_at' },
                        month: { $month: '$created_at' },
                    },
                    count: { $sum: 1 },
                },
            },
        ])

        const map = new Map(
            aggregated.map((r) => [`${r._id.year}-${r._id.month}`, r.count])
        )

        const labels = []
        const data = []
        for (let i = 0; i < monthsBack; i++) {
            const d = addMonths(start, i)
            labels.push(MONTH_LABELS[d.getMonth()])
            const key = `${d.getFullYear()}-${d.getMonth() + 1}`
            data.push(map.get(key) || 0)
        }
        return { labels, data }
    }

    // ── STATUS DISTRIBUTION ─────────────────────────────────────────────────
    async getStatusDistribution() {
        const aggregated = await Application.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ])
        const byStatus = aggregated.reduce((acc, r) => {
            acc[r._id] = r.count
            return acc
        }, {})

        // Bucket into Approved (verified+passed) / Pending / Rejected (rejected+failed)
        const approved = (byStatus.verified || 0) + (byStatus.passed || 0)
        const pending = byStatus.pending || 0
        const rejected = (byStatus.rejected || 0) + (byStatus.failed || 0)

        return { approved, pending, rejected, total: approved + pending + rejected }
    }

    // ── RECENT ACTIVITY ─────────────────────────────────────────────────────
    async getRecentActivities(limit = 10) {
        // Combine 2 sources: recent submitted invoices + recent application status changes
        const [recentInvoices, recentApps] = await Promise.all([
            Invoice.find({ isSubmitted: true })
                .populate('userId', 'name email')
                .sort({ submittedAt: -1, created_at: -1 })
                .limit(limit),
            Application.find({ verified_at: { $ne: null } })
                .populate('user_id', 'name email')
                .sort({ verified_at: -1 })
                .limit(limit),
        ])

        const items = []

        for (const inv of recentInvoices) {
            const user = inv.userId
            if (!user) continue
            const isPaid = inv.status === 'paid'
            items.push({
                _id: `inv-${inv._id}`,
                user: user.name || user.email || 'Người dùng',
                userId: String(user._id),
                action: isPaid ? 'Thanh toán lệ phí' : 'Nộp hồ sơ',
                time: formatRelativeTime(inv.submittedAt || inv.created_at),
                rawTime: inv.submittedAt || inv.created_at,
                status: isPaid ? 'Success' : 'Info',
            })
        }

        for (const app of recentApps) {
            const user = app.user_id
            if (!user) continue
            const isApproved = ['verified', 'passed'].includes(app.status)
            const isRejected = ['rejected', 'failed'].includes(app.status)
            items.push({
                _id: `app-${app._id}`,
                user: user.name || user.email || 'Người dùng',
                userId: String(user._id),
                action: isApproved
                    ? 'Hồ sơ được duyệt'
                    : isRejected
                        ? 'Hồ sơ bị từ chối'
                        : 'Cập nhật trạng thái hồ sơ',
                time: formatRelativeTime(app.verified_at),
                rawTime: app.verified_at,
                status: isApproved ? 'Success' : isRejected ? 'Error' : 'Info',
            })
        }

        items.sort((a, b) => new Date(b.rawTime).getTime() - new Date(a.rawTime).getTime())
        return items.slice(0, limit).map((it) => {
            const copy = { ...it }
            delete copy.rawTime
            return copy
        })
    }

    // ── ALL-IN-ONE ──────────────────────────────────────────────────────────
    async getOverview(opts = {}) {
        const { activityLimit = 10, trendMonths = 7 } = opts
        const [stats, trend, statusDistribution, recentActivities, activeRound] =
            await Promise.all([
                this.getStats(),
                this.getRegistrationTrend(trendMonths),
                this.getStatusDistribution(),
                this.getRecentActivities(activityLimit),
                Round.findOne({ status: 'open' }).sort({ startDate: -1 }).lean(),
            ])

        return {
            stats,
            trend,
            statusDistribution,
            recentActivities,
            activeRound: activeRound
                ? {
                    _id: String(activeRound._id),
                    code: activeRound.code,
                    name: activeRound.name,
                    year: activeRound.year,
                    startDate: activeRound.startDate,
                    endDate: activeRound.endDate,
                }
                : null,
        }
    }

    // ── STAFF-SCOPED: same overview + an extra counter (myVerifiedCount) ────
    async getStaffOverview(staffId, opts = {}) {
        const overview = await this.getOverview(opts)
        if (!staffId) return overview

        const myVerifiedCount = await Application.countDocuments({
            verified_by: mongoose.Types.ObjectId.isValid(staffId)
                ? new mongoose.Types.ObjectId(staffId)
                : staffId,
            status: { $in: ['verified', 'passed'] },
        })

        return { ...overview, stats: { ...overview.stats, myVerifiedCount } }
    }
}

export default new DashboardService()
