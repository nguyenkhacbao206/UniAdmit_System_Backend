import { ForumComment, ForumPost, ForumVote, ForumReport, Staff, Admin } from '@/models'
import { resolveAuthors, attachAuthor } from './forum-post.service'
import NotificationService from '@/app/services/notification.service.js'

const notifyModerators = async ({ title, description, metadata }) => {
    try {
        const [staffList, adminList] = await Promise.all([
            Staff.find({ deleted: false }).select('_id'),
            Admin.find({ deleted: false }).select('_id'),
        ])
        const recipients = [...staffList, ...adminList]
        await Promise.all(
            recipients.map((m) =>
                NotificationService.createAndPush(m._id, {
                    title, description, type: 'system', metadata,
                }).catch(() => {})
            )
        )
    } catch (e) { /* swallow */ }
}

class ForumCommentService {
    async createComment(accountId, postId, body, accountType = 'User') {
        const post = await ForumPost.findOne({ _id: postId, deleted: false })
        if (!post) throw new Error('Không tìm thấy bài viết')

        if (body.parent_comment_id) {
            const parent = await ForumComment.findOne({
                _id: body.parent_comment_id,
                post_id: postId,
                deleted: false,
            })
            if (!parent) throw new Error('Không tìm thấy bình luận cha')
        }

        const comment = await ForumComment.create({
            post_id: postId,
            author_id: accountId,
            author_type: accountType,
            content: body.content,
            parent_comment_id: body.parent_comment_id || null,
        })

        await ForumPost.updateOne({ _id: postId }, { $inc: { comments_count: 1 } })

        const fresh = await ForumComment.findById(comment._id).lean()
        const authorMap = await resolveAuthors([
            { id: fresh.author_id, type: fresh.author_type || 'User' },
        ])
        return attachAuthor(fresh, authorMap)
    }

    async updateComment(accountId, commentId, body) {
        const comment = await ForumComment.findOne({ _id: commentId, deleted: false })
        if (!comment) throw new Error('Không tìm thấy bình luận')
        if (String(comment.author_id) !== String(accountId)) {
            throw new Error('Bạn không có quyền chỉnh sửa bình luận này')
        }
        comment.content = body.content
        await comment.save()
        return comment
    }

    async deleteComment(accountId, commentId) {
        const comment = await ForumComment.findOne({ _id: commentId, deleted: false })
        if (!comment) throw new Error('Không tìm thấy bình luận')
        if (String(comment.author_id) !== String(accountId)) {
            throw new Error('Bạn không có quyền xóa bình luận này')
        }
        comment.deleted = true
        await comment.save()
        await ForumPost.updateOne({ _id: comment.post_id }, { $inc: { comments_count: -1 } })
        return { _id: comment._id }
    }

    async listByPost(accountId, postId) {
        const post = await ForumPost.findOne({ _id: postId, deleted: false })
        if (!post) throw new Error('Không tìm thấy bài viết')

        const comments = await ForumComment.find({ post_id: postId, deleted: false })
            .sort({ created_at: 1 })
            .lean()

        const authorMap = await resolveAuthors(
            comments.map((c) => ({ id: c.author_id, type: c.author_type || 'User' }))
        )
        const withAuthors = comments.map((c) => attachAuthor(c, authorMap))

        const enriched = await this._attachUserVote(accountId, withAuthors)

        const map = new Map()
        const roots = []
        for (const c of enriched) {
            c.replies = []
            map.set(String(c._id), c)
        }
        for (const c of enriched) {
            if (c.parent_comment_id) {
                const parent = map.get(String(c.parent_comment_id))
                if (parent) parent.replies.push(c)
                else roots.push(c)
            } else {
                roots.push(c)
            }
        }
        return roots
    }

    async _attachUserVote(accountId, comments) {
        if (!comments.length) return comments
        if (!accountId) return comments.map((c) => ({ ...c, my_vote: 0 }))

        const ids = comments.map((c) => c._id)
        const votes = await ForumVote.find({
            user_id: accountId,
            comment_id: { $in: ids },
        }).select('comment_id vote')

        const voteMap = new Map(votes.map((v) => [String(v.comment_id), v.vote]))
        return comments.map((c) => ({ ...c, my_vote: voteMap.get(String(c._id)) || 0 }))
    }

    async voteComment(accountId, commentId, voteValue) {
        if (![1, -1, 0].includes(voteValue)) {
            throw new Error('Giá trị vote không hợp lệ')
        }
        const comment = await ForumComment.findOne({ _id: commentId, deleted: false })
        if (!comment) throw new Error('Không tìm thấy bình luận')

        const existing = await ForumVote.findOne({
            user_id: accountId,
            comment_id: commentId,
        })

        const prev = existing ? existing.vote : 0
        if (prev === voteValue) {
            return { upvotes: comment.upvotes, downvotes: comment.downvotes, my_vote: prev }
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
                comment_id: commentId,
                post_id: null,
                vote: voteValue,
            })
        }

        if (Object.keys(inc).length) {
            await ForumComment.updateOne({ _id: commentId }, { $inc: inc })
        }
        const fresh = await ForumComment.findById(commentId).select('upvotes downvotes')
        return {
            upvotes: fresh.upvotes,
            downvotes: fresh.downvotes,
            my_vote: voteValue,
        }
    }

    async markBestAnswer(accountId, commentId) {
        const comment = await ForumComment.findOne({ _id: commentId, deleted: false })
        if (!comment) throw new Error('Không tìm thấy bình luận')

        const post = await ForumPost.findOne({ _id: comment.post_id, deleted: false })
        if (!post) throw new Error('Không tìm thấy bài viết')
        if (String(post.author_id) !== String(accountId)) {
            throw new Error('Chỉ tác giả bài viết mới có thể chọn câu trả lời hay nhất')
        }

        await ForumComment.updateMany(
            { post_id: post._id, _id: { $ne: comment._id } },
            { $set: { is_best_answer: false } }
        )
        comment.is_best_answer = true
        await comment.save()

        post.is_resolved = true
        await post.save()

        return comment
    }

    async reportComment(accountId, commentId, body) {
        const comment = await ForumComment.findOne({ _id: commentId, deleted: false })
        if (!comment) throw new Error('Không tìm thấy bình luận')

        const existing = await ForumReport.findOne({
            comment_id: commentId,
            reporter_id: accountId,
            status: 'PENDING',
        })
        if (existing) {
            throw new Error('Bạn đã báo cáo bình luận này')
        }

        const report = await ForumReport.create({
            comment_id: commentId,
            reporter_id: accountId,
            reason: body.reason,
            details: body.details || '',
        })

        const snippet = (comment.content || '').slice(0, 80)
        await notifyModerators({
            title: '⚠️ Có báo cáo bình luận mới',
            description: `Bình luận "${snippet}" vừa bị báo cáo (lý do: ${body.reason || 'không rõ'}).`,
            metadata: { reportId: String(report._id), commentId: String(comment._id), kind: 'pending_report' },
        })

        return report
    }
}

export default new ForumCommentService()
