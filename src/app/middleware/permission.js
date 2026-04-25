import {abort} from '@/utils/helpers'
import {Role} from '@/models'

/**
 * Middleware cấp quyền truy cập theo Loại Tài Khoản (User Type).
 * Lọc vòng ngoài: Chỉ cho phép các kiểu người dùng được định định sẵn đi qua.
 * VD: allowAccountTypes('admin', 'user') => Cho phép Admin và User, chặn Staff.
 */
export const allowAccountTypes = (...allowedUserTypes) => {
    return async (req, res, next) => {
        const userType = req.userType || 'unknown'
        await Promise.resolve()
        
        if (!allowedUserTypes.includes(userType)) {
            return abort(403, 'Tài khoản của bạn không có đặc quyền truy cập tính năng này!')
        }
        
        next()
    }
}


/**
 * Middleware cấp quyền truy cập theo mã Role Code, áp dụng riêng cho Admin/Staff.
 * Lọc vòng trong: Kiểm tra xem Role ID chứa trong tài khoản có khớp với mã được cấp không.
 * Yêu cầu: Đã vượt qua `allowAccountTypes` để đảm bảo `req.currentAdmin` hoặc `req.currentStaff` đã tồn tại.
 * VD: requireAdminRoles('super-admin', 'admin-manager')
 */
export const requireAdminRoles = (...allowedRoleCodes) => {
    return async (req, res, next) => {
        try {
            const userType = req.userType

            // Nếu là 'user', họ không có Role Code như Admin, bị văng ngay
            // (Thường middleware này không dùng cho User, mà để chặn tác vụ quản trị)
            if (userType === 'user') {
                return abort(403, 'Người dùng thông thường không thể thao tác quyền quản trị!')
            }

            const currentUser = userType === 'admin' ? req.currentAdmin : req.currentStaff

            if (!currentUser) {
                return abort(401, 'Vui lòng đăng nhập để thực hiện hành động này!')
            }

            // Nếu API yêu cầu Role Code cụ thể, bắt đầu đối chiếu Database
            if (allowedRoleCodes.length === 0) {
                return next()
            }

            if (!currentUser.role_ids || currentUser.role_ids.length === 0) {
                return abort(403, 'Tài khoản chưa được phân quyền trên hệ thống!')
            }

            const userRoles = await Role.find({ _id: { $in: currentUser.role_ids } })
            const userRoleCodes = userRoles.map((r) => r.code)

            const hasAccess = userRoleCodes.some((code) => allowedRoleCodes.includes(code))

            if (!hasAccess) {
                return abort(403, 'Bạn không đủ quyền để thực hiện thao tác này!')
            }

            next()
        } catch (error) {
            next(error)
        }
    }
}
