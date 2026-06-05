// Staff forum moderation: reuse the admin forum service. Staff can perform
// the same moderation actions; admin-only sections (settings) are not exposed here.
import forumAdminService from '@/app/services/forum-admin.service.js'

const getActor = (req) => {
    if (req.currentStaff?._id) return { id: req.currentStaff._id, type: 'Staff' }
    if (req.currentAdmin?._id) return { id: req.currentAdmin._id, type: 'Admin' }
    return { id: null, type: 'System' }
}

const ok = (res, data, message = 'Thành công', status = 200) =>
    res.status(status).json({ success: true, message, data })
const fail = (res, err, status = 400) =>
    res.status(status).json({ success: false, message: err.message || 'Lỗi server' })

// Moderation list endpoints
export const listPending = async (req, res) => {
    try {
        const data = await forumAdminService.getPendingPosts(req.query)
        return ok(res, data, 'Lấy bài chờ duyệt thành công')
    } catch (err) { return fail(res, err, 500) }
}
export const listReported = async (req, res) => {
    try {
        const data = await forumAdminService.getReportedItems(req.query)
        return ok(res, data, 'Lấy bài bị báo cáo thành công')
    } catch (err) { return fail(res, err, 500) }
}

// Actions
export const approvePost = async (req, res) => {
    try {
        const data = await forumAdminService.approvePost(getActor(req), req.params.id)
        return ok(res, data, 'Duyệt bài viết thành công')
    } catch (err) { return fail(res, err) }
}
export const rejectPost = async (req, res) => {
    try {
        const data = await forumAdminService.rejectPost(getActor(req), req.params.id, req.body?.reason)
        return ok(res, data, 'Từ chối bài viết thành công')
    } catch (err) { return fail(res, err) }
}
export const deletePost = async (req, res) => {
    try {
        const data = await forumAdminService.hardDeletePost(getActor(req), req.params.id, req.body?.reason)
        return ok(res, data, 'Xóa bài viết thành công')
    } catch (err) { return fail(res, err) }
}
export const deleteComment = async (req, res) => {
    try {
        const data = await forumAdminService.deleteComment(getActor(req), req.params.id, req.body?.reason)
        return ok(res, data, 'Xóa bình luận thành công')
    } catch (err) { return fail(res, err) }
}
export const resolveReport = async (req, res) => {
    try {
        const data = await forumAdminService.resolveReport(getActor(req), req.params.id)
        return ok(res, data, 'Xử lý báo cáo thành công')
    } catch (err) { return fail(res, err) }
}
export const dismissReport = async (req, res) => {
    try {
        const data = await forumAdminService.dismissReport(getActor(req), req.params.id)
        return ok(res, data, 'Bỏ qua báo cáo thành công')
    } catch (err) { return fail(res, err) }
}

// Tags — staff can also manage tags
export const listTags = async (req, res) => {
    try {
        const data = await forumAdminService.listTags()
        return ok(res, data, 'Lấy danh sách tag thành công')
    } catch (err) { return fail(res, err, 500) }
}
export const createTag = async (req, res) => {
    try {
        const data = await forumAdminService.createTag(getActor(req), req.body)
        return ok(res, data, 'Thêm tag thành công', 201)
    } catch (err) { return fail(res, err) }
}
export const updateTag = async (req, res) => {
    try {
        const data = await forumAdminService.updateTag(getActor(req), req.params.id, req.body)
        return ok(res, data, 'Cập nhật tag thành công')
    } catch (err) { return fail(res, err) }
}
export const deleteTag = async (req, res) => {
    try {
        const data = await forumAdminService.deleteTag(getActor(req), req.params.id)
        return ok(res, data, 'Xóa tag thành công')
    } catch (err) { return fail(res, err) }
}
