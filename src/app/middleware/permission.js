import {abort} from '@/utils/helpers'
import {Role} from '@/models'

/**
 * Middleware dùng chung để kiểm tra quyền truy cập dựa trên bảng Role.
 * Bạn có thể cắm middleware này vào route của Admin hoặc Staff.
 * Yêu cầu: router trước đó đã chạy middleware xác thực (bơm `req.currentAdmin` hoặc `req.currentStaff` vào request).
 */
export const requireRole = (allowedRoleCodes, accountType = 'admin') => {
    return async (req, res, next) => {
        try {
            // Xác định lấy user detail từ req.currentAdmin hay req.currentStaff
            const currentUser = accountType === 'admin' ? req.currentAdmin : req.currentStaff

            if (!currentUser) {
                abort(401, 'Vui lòng đăng nhập để thực hiện hành động này!')
            }

            // Nếu user không có role_ids nào
            if (!currentUser.role_ids || currentUser.role_ids.length === 0) {
                abort(403, 'Tài khoản chưa được cấp quyền (role) nào trên hệ thống!')
            }

            const userRoles = await Role.find({ _id: { $in: currentUser.role_ids } })
            const userRoleCodes = userRoles.map((r) => r.code)

            // Kiểm tra xem array role code của user có mã nào khớp với danh sách cho phép không
            const hasAccess = userRoleCodes.some((code) => allowedRoleCodes.includes(code))

            if (!hasAccess) {
                abort(403, 'Bạn không đủ quyền để thực hiện thao tác này!')
            }

            next()
        } catch (error) {
            next(error)
        }
    }
}
