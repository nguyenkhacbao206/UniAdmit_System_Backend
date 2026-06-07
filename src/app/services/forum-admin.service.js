import mongoose from 'mongoose'
import {
    ForumPost,
    ForumComment,
    ForumReport,
    ForumVote,
    ForumTag,
    ForumSetting,
    ForumAuditLog,
    User,
    Staff,
    Admin,
} from '@/models'
import { resolveAuthors, attachAuthor } from './forum-post.service'

const DEFAULT_SETTING = {
    scope: 'forum',
    autoApproveMentors: true,
    toxicAction: 'hide',
    maxPostsPerDay: 5,
    maxCommentsPerDay: 50,
    bannedWords: [],
}

const startOfWeek = () => {
    const d = new Date()
    const day = d.getDay() // Sun=0 ... Sat=6
    const monday = new Date(d)
    const offset = (day + 6) % 7 // 0=Mon
    monday.setDate(d.getDate() - offset)
    monday.setHours(0, 0, 0, 0)
    return monday
}

const lookupActor = async (actorId, actorType) => {
    if (!actorId) return { name: 'Hệ thống', type: 'System' }
    try {
        if (actorType === 'Admin') {
            const a = await Admin.findById(actorId).select('name email')
            if (a) return { name: a.name || a.email || 'Admin', type: 'Admin' }
        }
        if (actorType === 'Staff') {
            const s = await Staff.findById(actorId).select('name email')
            if (s) return { name: s.name || s.email || 'Staff', type: 'Staff' }
        }
        if (actorType === 'User') {
            const u = await User.findById(actorId).select('name email')
            if (u) return { name: u.name || u.email || 'User', type: 'User' }
        }
        // Fallback search across all 3
        const [a, s, u] = await Promise.all([
            Admin.findById(actorId).select('name email'),
            Staff.findById(actorId).select('name email'),
            User.findById(actorId).select('name email'),
        ])
        if (a) return { name: a.name || a.email || 'Admin', type: 'Admin' }
        if (s) return { name: s.name || s.email || 'Staff', type: 'Staff' }
        if (u) return { name: u.name || u.email || 'User', type: 'User' }
    } catch (e) {
        /* ignore */
    }
    return { name: 'Không xác định', type: actorType || 'System' }
}

class ForumAdminService {
    // ════════════════════════════════════════════════════════════════════════
    // SETTINGS
    // ════════════════════════════════════════════════════════════════════════
    async getSettings() {
        let doc = await ForumSetting.findOne({ scope: 'forum' })
        if (!doc) {
            doc = await ForumSetting.create(DEFAULT_SETTING)
        }
        return doc
    }

    async updateSettings(actor, body) {
        const allowed = [
            'autoApproveMentors',
            'toxicAction',
            'maxPostsPerDay',
            'maxCommentsPerDay',
            'bannedWords',
        ]
        const patch = {}
        for (const k of allowed) {
            if (typeof body[k] !== 'undefined') patch[k] = body[k]
        }

        const before = await this.getSettings()
        const after = await ForumSetting.findOneAndUpdate(
            { scope: 'forum' },
            { $set: patch },
            { new: true, upsert: true }
        )

        await this.log({
            actor,
            action: 'settings_update',
            actionLabel: 'Cập nhật cài đặt diễn đàn',
            targetType: 'ForumSetting',
            targetId: after?._id,
            targetLabel: 'Cài đặt diễn đàn',
            status: 'success',
            metadata: { changedKeys: Object.keys(patch), before: before.toObject(), after: after.toObject() },
        })

        return after
    }

    // ════════════════════════════════════════════════════════════════════════
    // TAGS
    // ════════════════════════════════════════════════════════════════════════
    async listTags() {
        const tags = await ForumTag.find({}).sort({ name: 1 }).lean()

        // Compute postCount per tag from ForumPost.tags (string array)
        const counts = await ForumPost.aggregate([
            { $match: { deleted: false } },
            { $unwind: '$tags' },
            { $group: { _id: '$tags', count: { $sum: 1 } } },
        ])
        const countMap = new Map(counts.map((c) => [c._id, c.count]))

        return tags.map((t) => ({
            ...t,
            id: String(t._id),
            postCount: countMap.get(t.name) || 0,
        }))
    }

    async createTag(actor, body) {
        if (!body?.name || !String(body.name).trim()) {
            throw new Error('Tên tag không được rỗng')
        }
        const name = String(body.name).trim()

        const exists = await ForumTag.findOne({ name })
        if (exists) throw new Error('Tag đã tồn tại')

        const tag = await ForumTag.create({
            name,
            color: body.color || 'blue',
            description: body.description || '',
            status: 'active',
        })

        await this.log({
            actor,
            action: 'tag_create',
            actionLabel: 'Thêm tag mới',
            targetType: 'ForumTag',
            targetId: tag._id,
            targetLabel: `#${tag.name}`,
        })
        return tag
    }

    async updateTag(actor, id, body) {
        const allowed = ['name', 'color', 'status', 'description']
        const patch = {}
        for (const k of allowed) {
            if (typeof body[k] !== 'undefined') patch[k] = body[k]
        }
        const tag = await ForumTag.findByIdAndUpdate(id, patch, { new: true })
        if (!tag) throw new Error('Không tìm thấy tag')

        await this.log({
            actor,
            action: 'tag_update',
            actionLabel: 'Cập nhật tag',
            targetType: 'ForumTag',
            targetId: tag._id,
            targetLabel: `#${tag.name}`,
        })
        return tag
    }

    async deleteTag(actor, id) {
        const tag = await ForumTag.findById(id)
        if (!tag) throw new Error('Không tìm thấy tag')
        await ForumTag.deleteOne({ _id: id })

        await this.log({
            actor,
            action: 'tag_delete',
            actionLabel: 'Xóa tag',
            targetType: 'ForumTag',
            targetId: tag._id,
            targetLabel: `#${tag.name}`,
            status: 'warning',
        })
        return { _id: tag._id }
    }

    // ════════════════════════════════════════════════════════════════════════
    // MODERATION: pending posts, reports
    // ════════════════════════════════════════════════════════════════════════
    async getPendingPosts(query = {}) {
        const { page = 1, limit = 20 } = query
        const filter = { deleted: false, status: 'PENDING' }

        const total = await ForumPost.countDocuments(filter)
        const posts = await ForumPost.find(filter)
            .sort({ created_at: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .lean()

        const authorMap = await resolveAuthors(
            posts.map((p) => ({ id: p.author_id, type: p.author_type || 'User' }))
        )
        const items = posts.map((p) => attachAuthor(p, authorMap))

        return { items, total, page: Number(page), limit: Number(limit) }
    }

    async getReportedItems(query = {}) {
        const { page = 1, limit = 20, status = 'PENDING' } = query

        const filter = {}
        if (status) filter.status = status

        const total = await ForumReport.countDocuments(filter)
        const reports = await ForumReport.find(filter)
            .sort({ created_at: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .lean()

        const postIds = reports.filter((r) => r.post_id).map((r) => r.post_id)
        const commentIds = reports.filter((r) => r.comment_id).map((r) => r.comment_id)
        const reporterIds = reports.map((r) => r.reporter_id).filter(Boolean)

        const [posts, comments, reporters] = await Promise.all([
            postIds.length ? ForumPost.find({ _id: { $in: postIds } }).lean() : [],
            commentIds.length ? ForumComment.find({ _id: { $in: commentIds } }).lean() : [],
            reporterIds.length ? User.find({ _id: { $in: reporterIds } }).select('name email').lean() : [],
        ])

        const postMap = new Map(posts.map((p) => [String(p._id), p]))
        const commentMap = new Map(comments.map((c) => [String(c._id), c]))
        const reporterMap = new Map(reporters.map((u) => [String(u._id), u]))

        const items = reports.map((r) => {
            const post = r.post_id ? postMap.get(String(r.post_id)) : null
            const comment = r.comment_id ? commentMap.get(String(r.comment_id)) : null
            const reporter = r.reporter_id ? reporterMap.get(String(r.reporter_id)) : null
            return {
                _id: r._id,
                post_id: r.post_id || null,
                comment_id: r.comment_id || null,
                title: post?.title || (comment ? comment.content?.slice(0, 80) : 'Bài viết / bình luận đã xóa'),
                kind: post ? 'post' : 'comment',
                reason: r.reason,
                details: r.details || '',
                status: r.status,
                reporter: reporter ? reporter.name || reporter.email : 'Ẩn danh',
                created_at: r.created_at,
            }
        })
        return { items, total, page: Number(page), limit: Number(limit) }
    }

    async approvePost(actor, postId) {
        const post = await ForumPost.findById(postId)
        if (!post) throw new Error('Không tìm thấy bài viết')
        post.status = 'APPROVED'
        await post.save()
        await this.log({
            actor,
            action: 'post_approve',
            actionLabel: 'Duyệt bài viết',
            targetType: 'ForumPost',
            targetId: post._id,
            targetLabel: post.title?.slice(0, 80) || `Bài viết #${post._id}`,
        })
        return post
    }

    async rejectPost(actor, postId, reason) {
        const post = await ForumPost.findById(postId)
        if (!post) throw new Error('Không tìm thấy bài viết')
        post.status = 'REJECTED'
        await post.save()
        await this.log({
            actor,
            action: 'post_reject',
            actionLabel: 'Từ chối bài viết',
            targetType: 'ForumPost',
            targetId: post._id,
            targetLabel: post.title?.slice(0, 80) || `Bài viết #${post._id}`,
            status: 'warning',
            metadata: { reason: reason || '' },
        })
        return post
    }

    async hardDeletePost(actor, postId, reason) {
        const post = await ForumPost.findById(postId)
        if (!post) throw new Error('Không tìm thấy bài viết')
        post.deleted = true
        await post.save()
        // Auto-resolve mọi report đang PENDING trỏ tới bài này — staff đã xử lý
        // bằng cách xóa nội dung, không cần resolve từng report một.
        await ForumReport.updateMany(
            { post_id: post._id, status: 'PENDING' },
            { $set: { status: 'RESOLVED' } }
        )
        await this.log({
            actor,
            action: 'post_delete',
            actionLabel: 'Xóa bài viết',
            targetType: 'ForumPost',
            targetId: post._id,
            targetLabel: post.title?.slice(0, 80) || `Bài viết #${post._id}`,
            status: 'warning',
            metadata: { reason: reason || '' },
        })
        return { _id: post._id }
    }

    async deleteComment(actor, commentId, reason) {
        const comment = await ForumComment.findById(commentId)
        if (!comment) throw new Error('Không tìm thấy bình luận')
        comment.deleted = true
        await comment.save()
        await ForumPost.updateOne({ _id: comment.post_id }, { $inc: { comments_count: -1 } })
        // Auto-resolve mọi report đang PENDING trỏ tới comment này.
        await ForumReport.updateMany(
            { comment_id: comment._id, status: 'PENDING' },
            { $set: { status: 'RESOLVED' } }
        )
        await this.log({
            actor,
            action: 'comment_delete',
            actionLabel: 'Xóa bình luận',
            targetType: 'ForumComment',
            targetId: comment._id,
            targetLabel: (comment.content || '').slice(0, 80) || `Bình luận #${comment._id}`,
            status: 'warning',
            metadata: { reason: reason || '' },
        })
        return { _id: comment._id }
    }

    async resolveReport(actor, reportId) {
        const report = await ForumReport.findByIdAndUpdate(
            reportId,
            { $set: { status: 'RESOLVED' } },
            { new: true }
        )
        if (!report) throw new Error('Không tìm thấy báo cáo')
        await this.log({
            actor,
            action: 'report_resolve',
            actionLabel: 'Xử lý báo cáo',
            targetType: 'ForumReport',
            targetId: report._id,
            targetLabel: `Báo cáo #${report._id}`,
        })
        return report
    }

    async dismissReport(actor, reportId) {
        const report = await ForumReport.findByIdAndUpdate(
            reportId,
            { $set: { status: 'DISMISSED' } },
            { new: true }
        )
        if (!report) throw new Error('Không tìm thấy báo cáo')
        await this.log({
            actor,
            action: 'report_dismiss',
            actionLabel: 'Bỏ qua báo cáo',
            targetType: 'ForumReport',
            targetId: report._id,
            targetLabel: `Báo cáo #${report._id}`,
        })
        return report
    }

    // ════════════════════════════════════════════════════════════════════════
    // OVERVIEW: stats for admin dashboard
    // ════════════════════════════════════════════════════════════════════════
    async getOverview() {
        const since7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        const since30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

        const [
            totalPosts,
            activeUsersAgg,
            totalLikesAgg,
            totalCommentsCount,
            pendingReports,
        ] = await Promise.all([
            ForumPost.countDocuments({ deleted: false }),
            // Active users in last 30 days = anyone who posted or commented
            ForumPost.aggregate([
                { $match: { deleted: false, created_at: { $gte: since30Days } } },
                { $group: { _id: '$author_id' } },
                { $count: 'count' },
            ]),
            ForumPost.aggregate([
                { $match: { deleted: false } },
                { $group: { _id: null, up: { $sum: '$upvotes' }, down: { $sum: '$downvotes' } } },
            ]),
            ForumComment.countDocuments({ deleted: false }),
            ForumReport.countDocuments({ status: 'PENDING' }),
        ])

        const upTotal = totalLikesAgg[0]?.up || 0
        const downTotal = totalLikesAgg[0]?.down || 0

        // Weekly post volume (last 7 days, Mon→Sun)
        const weekStart = startOfWeek()
        const dayAgg = await ForumPost.aggregate([
            { $match: { deleted: false, created_at: { $gte: weekStart } } },
            {
                $group: {
                    _id: { $dayOfWeek: '$created_at' }, // 1=Sunday … 7=Saturday
                    count: { $sum: 1 },
                },
            },
        ])
        // Convert Sun-first to Mon-first labels
        const dayMap = new Map(dayAgg.map((d) => [d._id, d.count]))
        const weeklyLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
        const dowOrder = [2, 3, 4, 5, 6, 7, 1] // Mon..Sat..Sun
        const weeklyData = dowOrder.map((d) => dayMap.get(d) || 0)

        // Top categories (tag aggregation, recent 30 days vs previous 30 days for trend)
        const since60Days = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
        const tagAgg = await ForumPost.aggregate([
            { $match: { deleted: false } },
            { $unwind: '$tags' },
            {
                $facet: {
                    recent: [
                        { $match: { created_at: { $gte: since30Days } } },
                        { $group: { _id: '$tags', count: { $sum: 1 } } },
                    ],
                    previous: [
                        { $match: { created_at: { $gte: since60Days, $lt: since30Days } } },
                        { $group: { _id: '$tags', count: { $sum: 1 } } },
                    ],
                    total: [{ $group: { _id: '$tags', count: { $sum: 1 } } }],
                },
            },
        ])

        const recentMap = new Map((tagAgg[0]?.recent || []).map((r) => [r._id, r.count]))
        const previousMap = new Map((tagAgg[0]?.previous || []).map((r) => [r._id, r.count]))
        const totalMap = new Map((tagAgg[0]?.total || []).map((r) => [r._id, r.count]))

        const trendingCategories = [...totalMap.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, posts]) => {
                const recent = recentMap.get(name) || 0
                const prev = previousMap.get(name) || 0
                const trendPercent =
                    prev > 0 ? Math.round(((recent - prev) / prev) * 100) : recent > 0 ? 100 : 0
                return {
                    name,
                    posts,
                    trend: `${trendPercent >= 0 ? '+' : ''}${trendPercent}%`,
                    trendPercent,
                }
            })

        return {
            stats: {
                totalPosts,
                activeUsers: activeUsersAgg[0]?.count || 0,
                totalInteractions: upTotal + downTotal + totalCommentsCount,
                totalUpvotes: upTotal,
                totalDownvotes: downTotal,
                totalComments: totalCommentsCount,
                reports: pendingReports,
            },
            weekly: { labels: weeklyLabels, data: weeklyData },
            trendingCategories,
            updatedAt: new Date(),
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // AUDIT LOGS
    // ════════════════════════════════════════════════════════════════════════
    async log({
        actor,
        action,
        actionLabel = '',
        targetType = '',
        targetId = null,
        targetLabel = '',
        status = 'success',
        metadata = {},
    }) {
        const actorInfo = await lookupActor(actor?.id, actor?.type)
        try {
            await ForumAuditLog.create({
                action,
                actionLabel,
                actorId: actor?.id || null,
                actorName: actorInfo.name,
                actorType: actorInfo.type,
                targetType,
                targetId,
                targetLabel,
                status,
                metadata,
            })
        } catch (e) {
            // never let logging crash the action
        }
    }

    async listLogs(query = {}) {
        const { page = 1, limit = 20, search = '', action } = query
        const filter = {}
        if (action) filter.action = action
        if (search) {
            const rx = new RegExp(search, 'i')
            filter.$or = [
                { actorName: rx },
                { actionLabel: rx },
                { targetLabel: rx },
            ]
        }

        const total = await ForumAuditLog.countDocuments(filter)
        const items = await ForumAuditLog.find(filter)
            .sort({ created_at: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .lean()

        return {
            items: items.map((it) => ({
                _id: it._id,
                time: it.created_at,
                action: it.actionLabel || it.action,
                actionCode: it.action,
                actor: it.actorName
                    ? `${it.actorName}${it.actorType ? ` (${it.actorType})` : ''}`
                    : 'Hệ thống',
                target: it.targetLabel || '',
                status: it.status,
                metadata: it.metadata || {},
            })),
            total,
            page: Number(page),
            limit: Number(limit),
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // TOP MENTORS (public sidebar widget)
    // ════════════════════════════════════════════════════════════════════════
    async getTopMentors(limit = 5) {
        const agg = await ForumComment.aggregate([
            { $match: { deleted: false } },
            { $group: { _id: '$author_id', answers: { $sum: 1 } } },
            { $sort: { answers: -1 } },
            { $limit: Number(limit) * 3 }, // overfetch in case some are deleted users
        ])

        const ids = agg.map((a) => a._id).filter(Boolean)
        if (!ids.length) return []

        const [users, staff] = await Promise.all([
            User.find({ _id: { $in: ids } }).select('name avatar email').lean(),
            Staff.find({ _id: { $in: ids } }).select('name avatar email').lean(),
        ])
        const userMap = new Map(users.map((u) => [String(u._id), { ...u, role: 'Thí sinh' }]))
        const staffMap = new Map(staff.map((s) => [String(s._id), { ...s, role: 'Mentor tuyển sinh' }]))

        const mentors = []
        for (const a of agg) {
            const key = String(a._id)
            const u = staffMap.get(key) || userMap.get(key)
            if (!u) continue
            mentors.push({
                _id: a._id,
                name: u.name || 'Người dùng',
                avatar: u.avatar || '',
                role: u.role,
                answers: a.answers,
            })
            if (mentors.length >= Number(limit)) break
        }
        return mentors
    }
}

const instance = new ForumAdminService()
export default instance
export const auditLog = instance.log.bind(instance)
