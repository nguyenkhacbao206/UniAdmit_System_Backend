import * as authService from '@/app/services/auth.service'
import { APP_NAME } from '@/configs'
import { abort } from '@/utils/helpers'

export async function loginUniversal(req, res) {
    const loginResult = await authService.universalLogin(req.body)

    if (loginResult.requires_otp) {
        const user = loginResult.user
        res.sendMail(user.email, `[${APP_NAME}] Xác thực đăng nhập`, 'emails/login-otp', {
            name: user.name,
            otp: user.otp,
            appName: APP_NAME
        })

        res.jsonify({
            requires_otp: true,
            account_type: 'user',
            email: user.email,
            message: 'Vui lòng kiểm tra email để lấy mã xác thực đăng nhập.',
        })
        return
    }

    // Lưu refresh token vào cookie (httpOnly)
    res.cookie('refreshToken', loginResult.tokenData.refresh_token, {
        httpOnly: true,
        secure: false, // dev thì false, production -> true
        sameSite: 'Lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    // Trả access token & roles phân hướng
    res.jsonify({
        access_token: loginResult.tokenData.access_token,
        expire_in: loginResult.tokenData.expire_in,
        auth_type: loginResult.tokenData.auth_type,
        roles: loginResult.roles,
        account_type: loginResult.account_type
    })
}

export async function meUniversal(req, res) {
    if (req.accountType === 'admin') {
        const result = await authService.profileAdmin(req.currentAdmin)
        res.jsonify({ ...result, account_type: 'admin', roles: req.currentAdminRoles })
    } else if (req.accountType === 'staff') {
        const staffData = req.currentStaff.toObject()
        delete staffData.password
        res.jsonify({ ...staffData, account_type: 'staff', roles: ['staff'] })
    } else if (req.accountType === 'user') {
        // Just return the user obj without pw
        res.jsonify({ ...req.currentUser.toObject(), account_type: 'user', roles: ['user'] })
    } else {
        abort(401)
    }
}
