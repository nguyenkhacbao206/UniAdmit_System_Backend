import forumPostService from '@/app/services/forum-post.service'
import forumCommentService from '@/app/services/forum-comment.service'
import forumAdminService from '@/app/services/forum-admin.service'

const ok = (res, data, message = 'Thành công', status = 200) =>
    res.status(status).json({ success: true, message, data })

const fail = (res, err, status = 400) =>
    res.status(status).json({ success: false, message: err.message || 'Lỗi server' })

// Forum is open to any logged-in account (user / staff / admin).
// This resolves to whichever id is on the request after globalAuth ran.
const getAccountId = (req) =>
    req.currentUser?._id || req.currentStaff?._id || req.currentAdmin?._id

const getAccountType = (req) => {
    if (req.currentStaff?._id) return 'Staff'
    if (req.currentAdmin?._id) return 'Admin'
    return 'User'
}

// ===== POSTS =====

export const listPosts = async (req, res) => {
    try {
        const userId = getAccountId(req)
        const data = await forumPostService.listPosts(userId, req.query)
        return ok(res, data, 'Lấy danh sách bài viết thành công')
    } catch (err) {
        return fail(res, err, 500)
    }
}

export const getTrending = async (req, res) => {
    try {
        const data = await forumPostService.getTrending(req.query.limit)
        return ok(res, data, 'Lấy bài viết trending thành công')
    } catch (err) {
        return fail(res, err, 500)
    }
}

export const getPopularTags = async (req, res) => {
    try {
        const data = await forumPostService.getPopularTags(req.query.limit)
        return ok(res, data, 'Lấy tag phổ biến thành công')
    } catch (err) {
        return fail(res, err, 500)
    }
}

export const getTopMentors = async (req, res) => {
    try {
        const limit = req.query.limit ? Number(req.query.limit) : 5
        const data = await forumAdminService.getTopMentors(limit)
        return ok(res, data, 'Lấy mentor nổi bật thành công')
    } catch (err) {
        return fail(res, err, 500)
    }
}

export const getPost = async (req, res) => {
    try {
        const userId = getAccountId(req)
        const data = await forumPostService.getPostById(userId, req.params.id, true)
        return ok(res, data, 'Lấy chi tiết bài viết thành công')
    } catch (err) {
        return fail(res, err, 404)
    }
}

export const createPost = async (req, res) => {
    try {
        console.log('[forum.createPost] account:', getAccountType(req), getAccountId(req), 'body:', JSON.stringify(req.body))
        const data = await forumPostService.createPost(
            getAccountId(req),
            req.body,
            getAccountType(req)
        )
        return ok(res, data, 'Đăng bài thành công', 201)
    } catch (err) {
        console.error('[forum.createPost] error:', err)
        return fail(res, err)
    }
}

export const updatePost = async (req, res) => {
    try {
        const data = await forumPostService.updatePost(
            getAccountId(req),
            req.params.id,
            req.body
        )
        return ok(res, data, 'Cập nhật bài viết thành công')
    } catch (err) {
        return fail(res, err)
    }
}

export const deletePost = async (req, res) => {
    try {
        const data = await forumPostService.deletePost(getAccountId(req), req.params.id)
        return ok(res, data, 'Xóa bài viết thành công')
    } catch (err) {
        return fail(res, err)
    }
}

export const votePost = async (req, res) => {
    try {
        const data = await forumPostService.votePost(
            getAccountId(req),
            req.params.id,
            Number(req.body.vote)
        )
        return ok(res, data, 'Đã ghi nhận đánh giá')
    } catch (err) {
        return fail(res, err)
    }
}

export const toggleBookmark = async (req, res) => {
    try {
        const data = await forumPostService.toggleBookmark(
            getAccountId(req),
            req.params.id
        )
        return ok(res, data, data.bookmarked ? 'Đã lưu bài viết' : 'Đã bỏ lưu bài viết')
    } catch (err) {
        return fail(res, err)
    }
}

export const reportPost = async (req, res) => {
    try {
        const data = await forumPostService.reportPost(
            getAccountId(req),
            req.params.id,
            req.body
        )
        return ok(res, data, 'Đã gửi báo cáo, cảm ơn bạn!', 201)
    } catch (err) {
        return fail(res, err)
    }
}

export const markResolved = async (req, res) => {
    try {
        const data = await forumPostService.markResolved(
            getAccountId(req),
            req.params.id,
            req.body.is_resolved
        )
        return ok(res, data, 'Cập nhật trạng thái thành công')
    } catch (err) {
        return fail(res, err)
    }
}

// ===== COMMENTS =====

export const listComments = async (req, res) => {
    try {
        const userId = getAccountId(req)
        const data = await forumCommentService.listByPost(userId, req.params.id)
        return ok(res, data, 'Lấy danh sách bình luận thành công')
    } catch (err) {
        return fail(res, err, 404)
    }
}

export const createComment = async (req, res) => {
    try {
        const data = await forumCommentService.createComment(
            getAccountId(req),
            req.params.id,
            req.body,
            getAccountType(req)
        )
        return ok(res, data, 'Bình luận thành công', 201)
    } catch (err) {
        return fail(res, err)
    }
}

export const updateComment = async (req, res) => {
    try {
        const data = await forumCommentService.updateComment(
            getAccountId(req),
            req.params.commentId,
            req.body
        )
        return ok(res, data, 'Cập nhật bình luận thành công')
    } catch (err) {
        return fail(res, err)
    }
}

export const deleteComment = async (req, res) => {
    try {
        const data = await forumCommentService.deleteComment(
            getAccountId(req),
            req.params.commentId
        )
        return ok(res, data, 'Xóa bình luận thành công')
    } catch (err) {
        return fail(res, err)
    }
}

export const voteComment = async (req, res) => {
    try {
        const data = await forumCommentService.voteComment(
            getAccountId(req),
            req.params.commentId,
            Number(req.body.vote)
        )
        return ok(res, data, 'Đã ghi nhận đánh giá')
    } catch (err) {
        return fail(res, err)
    }
}

export const markBestAnswer = async (req, res) => {
    try {
        const data = await forumCommentService.markBestAnswer(
            getAccountId(req),
            req.params.commentId
        )
        return ok(res, data, 'Đã chọn câu trả lời hay nhất')
    } catch (err) {
        return fail(res, err)
    }
}

export const reportComment = async (req, res) => {
    try {
        const data = await forumCommentService.reportComment(
            getAccountId(req),
            req.params.commentId,
            req.body
        )
        return ok(res, data, 'Đã gửi báo cáo, cảm ơn bạn!', 201)
    } catch (err) {
        return fail(res, err)
    }
}
