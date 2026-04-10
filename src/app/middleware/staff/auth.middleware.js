import { abort, getToken, verifyToken } from '@/utils/helpers'
import _ from 'lodash'
import { tokenBlocklist } from '@/app/services/auth.service'
import { TOKEN_TYPE } from '@/configs'
import { Staff } from '@/models'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'

export async function checkValidToken(req, res, next) {
    try {
        const token = getToken(req.headers)

        if (token) {
            const allowedToken = _.isUndefined(await tokenBlocklist.get(token))
            if (allowedToken) {
                const { staffId } = verifyToken(token, TOKEN_TYPE.STAFF_AUTHORIZATION)
                const staff = await Staff.findOne({ _id: staffId, deleted: false })
                if (staff) {
                    req.currentStaff = staff
                    req.accountType = 'staff'
                    next()
                    return
                }
            }
        }
    } catch (error) {
        if (!(error instanceof JsonWebTokenError)) {
            throw error
        }
        if (error instanceof TokenExpiredError) {
            abort(401, 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập để tiếp tục!')
        }
    }
    abort(401)
}
