import { abort, getToken } from '@/utils/helpers'
import _ from 'lodash'
import { tokenBlocklist } from '@/app/services/auth.service'
import { TOKEN_TYPE, SECRET_KEY } from '@/configs'
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import { Admin, Staff, User } from '@/models'

export async function globalAuth(req, res, next) {
    try {
        const token = getToken(req.headers)
        if (!token) return abort(401, 'Vui lòng đăng nhập để tiếp tục.')

        const isAllowed = _.isUndefined(await tokenBlocklist.get(token))
        if (!isAllowed) {
            return abort(401, 'Phiên đăng nhập không hợp lệ hoặc đã bị đăng xuất.')
        }

        // Verify without assuming a specific type first
        const payload = jwt.verify(token, SECRET_KEY)
        const { type, data } = payload

        if (type === TOKEN_TYPE.ADMIN_AUTHORIZATION) {
            const admin = await Admin.findOne({ _id: data.adminId, deleted: false })
            if (admin) {
                req.currentAdmin = admin
                req.userType = 'admin'
                return next()
            }
        } else if (type === TOKEN_TYPE.STAFF_AUTHORIZATION) {
            const staff = await Staff.findOne({ _id: data.staffId, deleted: false })
            if (staff) {
                req.currentStaff = staff
                req.userType = 'staff'
                return next()
            }
        } else if (type === TOKEN_TYPE.USER_AUTHORIZATION) {
            const user = await User.findOne({ _id: data.userId, deleted: false })
            if (user) {
                req.currentUser = user
                req.userType = 'user'
                return next()
            }
        }
        
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return abort(401, 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập để tiếp tục!')
        }
        if (!(error instanceof JsonWebTokenError)) {
            throw error
        }
    }
    abort(401, 'Từ chối truy cập. Token không hợp lệ.')
}
