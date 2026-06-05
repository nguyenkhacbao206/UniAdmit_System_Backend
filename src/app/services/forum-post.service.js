import { ForumPost, ForumVote, ForumBookmark, ForumReport, ForumSetting, User, Staff, Admin } from '@/models'
import { auditLog } from '@/app/services/forum-admin.service'

// Lookup authors across User / Staff / Admin collections in a single round-trip per type,
// then return a Map keyed by string(id) → {_id, name, avatar, email, account_type}
const resolveAuthors = async (refs) => {
    if (!refs.length) return new Map()

    const buckets = { User: [], Staff: [], Admin: [] }
    for (const { id, type } of refs) {
        const key = buckets[type] ? type : 'User'
        buckets[key].push(id)
    }

    const queries = []
    if (buckets.User.length) {
        queries.push(
            User.find({ _id: { $in: buckets.User } })
                .select('name avatar email')
                .lean()
                .then((rows) => rows.map((r) => ({ ...r, account_type: 'User' })))
        )
    }
    if (buckets.Staff.length) {
        queries.push(
            Staff.find({ _id: { $in: buckets.Staff } })
                .select('name avatar email')
                .lean()
                .then((rows) => rows.map((r) => ({ ...r, account_type: 'Staff' })))
        )
    }
    if (buckets.Admin.length) {
        queries.push(
            Admin.find({ _id: { $in: buckets.Admin } })
                .select('name avatar email')
                .lean()
                .then((rows) => rows.map((r) => ({ ...r, account_type: 'Admin' })))
        )
    }

    const results = (await Promise.all(queries)).flat()
    return new Map(results.map((r) => [String(r._id), r]))
}

const attachAuthor = (doc, map) => {
    const author = map.get(String(doc.author_id))
    return {
        ...doc,
        author_id: author || { _id: doc.author_id, name: 'Người dùng', avatar: '', account_type: doc.author_type || 'User' },
    }
}

class ForumPostService {
    async createPost(accountId, body, accountType = 'User') {
        const images = Array.isArray(body.images) ? body.images : []

        // Apply settings: auto-approve Mentor/Staff/Admin posts when enabled;
        // anything else stays PENDING when autoApprove is off.
        let setting = null
        try {
            setting = await ForumSetting.findOne({ scope: 'forum' })
        } catch (e) { /* ignore */ }
        const autoApproveMentors = setting ? setting.autoApproveMentors : true

        let status = 'APPROVED'
        if (accountType === 'User') {
            // Default for regular candidates remains APPROVED (the historical default);
            // moderators can later toggle this by adding a per-role gate in settings.
            status = 'APPROVED'
        } else if (accountType === 'Staff' || accountType === 'Admin') {
            status = autoApproveMentors ? 'APPROVED' : 'PENDING'
        }

        // Banned words filter
        const banned = (setting?.bannedWords || []).filter(Boolean)
        if (banned.length) {
            const hay = `${body.title || ''} ${body.content || ''}`.toLowerCase()
            const hit = banned.some((w) => w && hay.includes(w))
            if (hit) {
                const action = setting?.toxicAction || 'hide'
                if (action === 'delete') {
                    throw new Error('Bài viết chứa từ ngữ không được phép.')
                }
                if (action === 'hide') status = 'PENDING'
                // 'censor' would replace words; left as a no-op for now.
            }
        }

        const post = await ForumPost.create({
            title: body.title,
            content: body.content || '',
            tags: body.tags || [],
            thumbnail: body.thumbnail || images[0] || '',
            images,
            author_id: accountId,
            author_type: accountType,
            status,
        })

        await auditLog({
            actor: { id: accountId, type: accountType },
            action: 'post_create',
            actionLabel: status === 'PENDING' ? 'Đăng bài (chờ duyệt)' : 'Đăng bài',
            targetType: 'ForumPost',
            targetId: post._id,
            targetLabel: post.title?.slice(0, 80),
            status: status === 'PENDING' ? 'warning' : 'success',
        })

        return post
    }

    async updatePost(accountId, postId, body) {
        const post = await ForumPost.findOne({ _id: postId, deleted: false })
        if (!post) throw new Error('Không tìm thấy bài viết')
        if (String(post.author_id) !== String(accountId)) {
            throw new Error('Bạn không có quyền chỉnh sửa bài viết này')
        }

        const updatable = ['title', 'content', 'tags', 'thumbnail', 'images']
        for (const key of updatable) {
            if (typeof body[key] !== 'undefined') post[key] = body[key]
        }
        await post.save()
        return post
    }

    async deletePost(accountId, postId) {
        const post = await ForumPost.findOne({ _id: postId, deleted: false })
        if (!post) throw new Error('Không tìm thấy bài viết')
        if (String(post.author_id) !== String(accountId)) {
            throw new Error('Bạn không có quyền xóa bài viết này')
        }
        post.deleted = true
        await post.save()
        return { _id: post._id }
    }

    async listPosts(accountId, query) {
        const {
            page = 1,
            limit = 10,
            search = '',
            sort = 'latest',
            tag = '',
            unanswered = false,
            bookmarked = false,
        } = query

        const pageNum = Math.max(1, parseInt(page))
        const limitNum = Math.min(50, Math.max(1, parseInt(limit)))

        const filter = {
            deleted: false,
            status: 'APPROVED',
        }

        if (search) {
            const regex = new RegExp(search, 'i')
            filter.$or = [{ title: regex }, { content: regex }, { tags: regex }]
        }
        if (tag) {
            filter.tags = tag
        }
        if (String(unanswered) === 'true') {
            filter.comments_count = 0
        }

        if (String(bookmarked) === 'true' && accountId) {
            const bookmarks = await ForumBookmark.find({ user_id: accountId }).select('post_id')
            filter._id = { $in: bookmarks.map((b) => b.post_id) }
        }

        let sortObj = { created_at: -1 }
        if (sort === 'trending') {
            sortObj = { upvotes: -1, views: -1, created_at: -1 }
        } else if (sort === 'most_viewed') {
            sortObj = { views: -1, created_at: -1 }
        }

        const total = await ForumPost.countDocuments(filter)
        const posts = await ForumPost.find(filter)
            .sort(sortObj)
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .lean()

        const authorMap = await resolveAuthors(
            posts.map((p) => ({ id: p.author_id, type: p.author_type || 'User' }))
        )
        const withAuthors = posts.map((p) => attachAuthor(p, authorMap))
        const enriched = await this._attachUserState(accountId, withAuthors)

        return {
            items: enriched,
            page: pageNum,
            limit: limitNum,
            total,
            total_pages: Math.ceil(total / limitNum),
        }
    }

    async getPostById(accountId, postId, incrementView = true) {
        const post = await ForumPost.findOne({ _id: postId, deleted: false }).lean()
        if (!post) throw new Error('Không tìm thấy bài viết')

        if (incrementView) {
            await ForumPost.updateOne({ _id: postId }, { $inc: { views: 1 } })
            post.views = (post.views || 0) + 1
        }

        const authorMap = await resolveAuthors([
            { id: post.author_id, type: post.author_type || 'User' },
        ])
        const withAuthor = attachAuthor(post, authorMap)
        const [enriched] = await this._attachUserState(accountId, [withAuthor])
        return enriched
    }

    async _attachUserState(accountId, posts) {
        if (!posts.length) return posts
        if (!accountId) {
            return posts.map((p) => ({ ...p, is_bookmarked: false, my_vote: 0 }))
        }

        const ids = posts.map((p) => p._id)

        const [bookmarks, votes] = await Promise.all([
            ForumBookmark.find({ user_id: accountId, post_id: { $in: ids } }).select('post_id'),
            ForumVote.find({ user_id: accountId, post_id: { $in: ids }, comment_id: null }).select('post_id vote'),
        ])
        const bookmarkSet = new Set(bookmarks.map((b) => String(b.post_id)))
        const voteMap = new Map(votes.map((v) => [String(v.post_id), v.vote]))

        return posts.map((p) => ({
            ...p,
            is_bookmarked: bookmarkSet.has(String(p._id)),
            my_vote: voteMap.get(String(p._id)) || 0,
        }))
    }

    async votePost(accountId, postId, voteValue) {
        if (![1, -1, 0].includes(voteValue)) {
            throw new Error('Giá trị vote không hợp lệ')
        }
        const post = await ForumPost.findOne({ _id: postId, deleted: false })
        if (!post) throw new Error('Không tìm thấy bài viết')

        const existing = await ForumVote.findOne({
            user_id: accountId,
            post_id: postId,
            comment_id: null,
        })

        const prev = existing ? existing.vote : 0
        if (prev === voteValue) {
            return { upvotes: post.upvotes, downvotes: post.downvotes, my_vote: prev }
        }

        const inc = {}
        if (prev === 1) inc.upvotes = -1
        if (prev === -1) inc.downvotes = -1
        if (voteValue === 1) inc.upvotes = (inc.upvotes || 0) + 1
        if (voteValue === -1) inc.downvotes = (inc.downvotes || 0) + 1

        if (voteValue === 0) {
            if (existing) await ForumVote.deleteOne({ _id: existing._id })
        } else if (existing) {
            existing.vote = voteValue
            await existing.save()
        } else {
            await ForumVote.create({
                user_id: accountId,
                post_id: postId,
                comment_id: null,
                vote: voteValue,
            })
        }

        if (Object.keys(inc).length) {
            await ForumPost.updateOne({ _id: postId }, { $inc: inc })
        }
        const fresh = await ForumPost.findById(postId).select('upvotes downvotes')
        return {
            upvotes: fresh.upvotes,
            downvotes: fresh.downvotes,
            my_vote: voteValue,
        }
    }

    async toggleBookmark(accountId, postId) {
        const post = await ForumPost.findOne({ _id: postId, deleted: false })
        if (!post) throw new Error('Không tìm thấy bài viết')

        const existing = await ForumBookmark.findOne({ user_id: accountId, post_id: postId })
        if (existing) {
            await ForumBookmark.deleteOne({ _id: existing._id })
            return { bookmarked: false }
        }
        await ForumBookmark.create({ user_id: accountId, post_id: postId })
        return { bookmarked: true }
    }

    async reportPost(accountId, postId, body) {
        const post = await ForumPost.findOne({ _id: postId, deleted: false })
        if (!post) throw new Error('Không tìm thấy bài viết')

        const existing = await ForumReport.findOne({
            post_id: postId,
            reporter_id: accountId,
            status: 'PENDING',
        })
        if (existing) {
            throw new Error('Bạn đã báo cáo bài viết này')
        }

        return await ForumReport.create({
            post_id: postId,
            reporter_id: accountId,
            reason: body.reason,
            details: body.details || '',
        })
    }

    async markResolved(accountId, postId, isResolved) {
        const post = await ForumPost.findOne({ _id: postId, deleted: false })
        if (!post) throw new Error('Không tìm thấy bài viết')
        if (String(post.author_id) !== String(accountId)) {
            throw new Error('Chỉ tác giả mới có thể đánh dấu bài viết này')
        }
        post.is_resolved = !!isResolved
        await post.save()
        return post
    }

    async getTrending(limit = 5) {
        const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        const posts = await ForumPost.find({
            deleted: false,
            status: 'APPROVED',
            created_at: { $gte: since },
        })
            .sort({ views: -1, upvotes: -1 })
            .limit(parseInt(limit))
            .select('title views upvotes comments_count tags')
            .lean()

        if (posts.length > 0) return posts

        return await ForumPost.find({ deleted: false, status: 'APPROVED' })
            .sort({ views: -1 })
            .limit(parseInt(limit))
            .select('title views upvotes comments_count tags')
            .lean()
    }

    async getPopularTags(limit = 10) {
        const result = await ForumPost.aggregate([
            { $match: { deleted: false, status: 'APPROVED' } },
            { $unwind: '$tags' },
            { $group: { _id: '$tags', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: parseInt(limit) },
            { $project: { _id: 0, tag: '$_id', count: 1 } },
        ])
        return result
    }
}

export default new ForumPostService()
export { resolveAuthors, attachAuthor }
