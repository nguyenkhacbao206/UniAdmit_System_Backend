import { abort, getToken, verifyToken } from '@/utils/helpers'
import { TOKEN_TYPE } from '@/configs'
import { Admin, User } from '@/models'
import { tokenBlocklist } from '@/app/services/auth.service'
import _ from 'lodash'

export async function checkUniversalToken(req, res, next) {
    try {
        const token = getToken(req.headers)
        if (!token) {
            abort(401, 'Không có access token.')
        }

        const allowedToken = _.isUndefined(await tokenBlocklist.get(token))
        if (!allowedToken) {
            abort(401, 'Token đã bị vô hiệu hóa.')
        }

        // 1. Thử giải mã Admin
        try {
            const { adminId, roles } = verifyToken(token, TOKEN_TYPE.ADMIN_AUTHORIZATION)
            const admin = await Admin.findOne({ _id: adminId, deleted: false })
            if (admin) {
                req.currentAdmin = admin
                req.currentAdminRoles = roles || []
                req.accountType = 'admin'
                return next()
            }
        } catch (e) {
            // Không phải admin, đi tiếp xuống user
        }

        // 2. Thử giải mã User
        try {
            const { userId } = verifyToken(token, TOKEN_TYPE.USER_AUTHORIZATION)
            const user = await User.findOne({ _id: userId, deleted: false })
            if (user) {
                req.currentUser = user
                req.accountType = 'user'
                return next()
            }
        } catch (e) {
            // Cả hai đều failed
        }

        abort(401, 'Token không hợp lệ hoặc đã hết hạn.')
    } catch (e) {
        abort(401, 'Xác thực thất bại.')
    }
}
