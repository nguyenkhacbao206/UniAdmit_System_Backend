import jwt from 'jsonwebtoken'
import { cache, ACCESS_TOKEN_EXPIRE_IN, REFRESH_TOKEN_EXPIRE_IN, TOKEN_TYPE } from '@/configs'
import { abort, generateToken, verifyToken } from '@/utils/helpers'
import { Admin, Permission, STATUS_ACCOUNT, User } from '@/models'
import moment from 'moment'

export const tokenBlocklist = cache.create('token-block-list')

export async function checkValidLoginAdmin({ phone, password }) {
    const user = await Admin.findOne({ phone, deleted: false })

    if (user) {
        const verified = user.verifyPassword(password)
        if (verified) {
            if (user.status === STATUS_ACCOUNT.DE_ACTIVE) {
                abort(400, 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản lý.')
            }
            return user
        }
    }

    return false
}

export function authToken(admin) {
    const accessToken = generateToken({ adminId: admin._id }, TOKEN_TYPE.ADMIN_AUTHORIZATION, ACCESS_TOKEN_EXPIRE_IN)
    const refreshToken = generateToken({ adminId: admin._id }, TOKEN_TYPE.ADMIN_REFRESH_TOKEN, REFRESH_TOKEN_EXPIRE_IN)

    const decode = jwt.decode(accessToken)
    const expireIn = decode.exp - decode.iat

    return {
        access_token: accessToken,
        refresh_token: refreshToken,
        expire_in: expireIn,
        auth_type: 'Bearer Token',
    }
}

export async function profileAdmin(currentAdmin) {
    const acc = await Admin.findById(currentAdmin._id).select('-password')
        .populate({ path: 'roles' })
        .lean()
    const permissionIds = [...acc.roles]
        .map((role) => role.permission_ids)
        .flat()
    const permissions = await Permission.find({ _id: { $in: permissionIds } })
    acc.permissions = permissions.map(({ code }) => code)
    delete acc.role_ids
    delete acc.roles
    return acc
}

export async function checkValidLoginUser({ email, password }) {
    // Tìm user theo email
    const user = await User.findOne({ email, deleted: false })

    if (user) {
        const verified = user.verifyPassword(password)
        if (verified) {
            if (user.status === STATUS_ACCOUNT.UNVERIFIED) {
                abort(400, 'Tài khoản chưa được xác thực. Vui lòng kiểm tra email.')
            }
            if (user.status === STATUS_ACCOUNT.DE_ACTIVE) {
                abort(400, 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản lý.')
            }
            return user
        }
    }

    return false
}

export function authTokenUser(user) {
    const accessToken = generateToken({ userId: user._id }, TOKEN_TYPE.USER_AUTHORIZATION, ACCESS_TOKEN_EXPIRE_IN)
    const refreshToken = generateToken({ userId: user._id }, TOKEN_TYPE.USER_REFRESH_TOKEN, REFRESH_TOKEN_EXPIRE_IN)

    const decode = jwt.decode(accessToken)
    const expireIn = decode.exp - decode.iat

    return {
        access_token: accessToken,
        refresh_token: refreshToken,
        expire_in: expireIn,
        auth_type: 'Bearer Token',
    }
}

export async function refreshUserToken(refreshToken) {
    try {
        const decoded = verifyToken(refreshToken, TOKEN_TYPE.USER_REFRESH_TOKEN)
        const user = await User.findOne({ _id: decoded.userId, deleted: false })

        if (!user || user.status === STATUS_ACCOUNT.DE_ACTIVE) {
            abort(401, 'Token không hợp lệ hoặc tài khoản đã bị khóa.')
        }

        return authTokenUser(user)
    } catch (e) {
        abort(401, 'Refresh token không hợp lệ hoặc đã hết hạn.')
    }
}

export async function refreshAdminToken(refreshToken) {
    try {
        const decoded = verifyToken(refreshToken, TOKEN_TYPE.ADMIN_REFRESH_TOKEN)
        const admin = await Admin.findOne({ _id: decoded.adminId, deleted: false })

        if (!admin || admin.status === STATUS_ACCOUNT.DE_ACTIVE) {
            abort(401, 'Token không hợp lệ hoặc tài khoản đã bị khóa.')
        }

        return authToken(admin)
    } catch (e) {
        abort(401, 'Refresh token không hợp lệ hoặc đã hết hạn.')
    }
}


export async function blockToken(token) {
    const decoded = jwt.decode(token)
    const expiresIn = decoded.exp
    const now = moment().unix()
    await tokenBlocklist.set(token, 1, expiresIn - now)
}

export async function updateOTP(user) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otp_expired_at = moment().add(10, 'minutes').toDate()

    user.otp = otp
    user.otp_expired_at = otp_expired_at
    await user.save()

    return user
}

export async function registerUser(userData) {
    const { email, phone, name, password } = userData

    // Kiểm tra email đã tồn tại chưa
    const existingEmail = await User.findOne({ email, deleted: false })
    if (existingEmail) {
        abort(400, 'Email đã được sử dụng.')
    }

    // Kiểm tra số điện thoại đã tồn tại chưa
    const existingPhone = await User.findOne({ phone, deleted: false })
    if (existingPhone) {
        abort(400, 'Số điện thoại đã được sử dụng.')
    }

    // Tạo user mới với status UNVERIFIED để bắt buộc xác thực qua email
    let user = await User.create({
        name,
        email,
        phone,
        password,
        status: STATUS_ACCOUNT.UNVERIFIED,
    })

    // Tạo OTP xác thực ngay sau khi đăng ký
    user = await updateOTP(user)

    return user
}

export async function verifyOTP({ email, otp }, checkUnverified = true) {
    const user = await User.findOne({ email, deleted: false })

    if (!user) {
        abort(400, 'Email không tồn tại.')
    }

    if (checkUnverified && user.status === STATUS_ACCOUNT.ACTIVE) {
        abort(400, 'Tài khoản đã được xác thực trước đó.')
    }

    if (user.otp !== otp) {
        abort(400, 'Mã xác thực không chính xác.')
    }

    if (moment().isAfter(user.otp_expired_at)) {
        abort(400, 'Mã xác thực đã hết hạn.')
    }

    if (user.status === STATUS_ACCOUNT.UNVERIFIED) {
        user.status = STATUS_ACCOUNT.ACTIVE
    }

    user.otp = ''
    user.otp_expired_at = null
    await user.save()

    return user
}

export async function findOrCreateUserByGoogle(profile) {
    let user = await User.findOne({ email: profile.email, deleted: false })

    if (!user) {
        user = await User.create({
            email: profile.email,
            name: profile.name,
            avatar: profile.picture,
            status: STATUS_ACCOUNT.ACTIVE,
            password: Math.random().toString(36).slice(-10), // Mật khẩu ngẫu nhiên cho social login
            phone: '',
        })
    }

    if (user.status === STATUS_ACCOUNT.DE_ACTIVE) {
        abort(400, 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản lý.')
    }

    return user
}
