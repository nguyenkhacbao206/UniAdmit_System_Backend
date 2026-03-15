import { google } from 'googleapis'
import { abort, getToken } from '@/utils/helpers'
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL, APP_URL_CLIENT, APP_NAME } from '@/configs'
import * as authService from '@/app/services/auth.service'

export async function login(req, res) {
    const user = await authService.checkValidLoginUser(req.body)

    if (user) {
        // Tạo và cập nhật OTP mới cho việc đăng nhập
        await authService.updateOTP(user)

        // Gửi mail OTP đăng nhập
        res.sendMail(user.email, `[${APP_NAME}] Xác thực đăng nhập`, 'emails/login-otp', {
            name: user.name,
            otp: user.otp,
            appName: APP_NAME
        })

        res.jsonify({
            message: 'Vui lòng kiểm tra email để lấy mã xác thực đăng nhập.',
            email: user.email
        })
    } else {
        abort(400, 'Tài khoản hoặc mật khẩu không đúng.')
    }
}

export async function verifyLoginOTP(req, res) {
    const user = await authService.verifyOTP(req.body, false) // false vì user đã ACTIVE rồi
    res.jsonify(authService.authTokenUser(user), 'Đăng nhập thành công.')
}

export async function register(req, res) {
    const user = await authService.registerUser(req.body)

    // Gửi mail OTP xác thực tài khoản
    res.sendMail(user.email, `[${APP_NAME}] Xác thực tài khoản`, 'emails/verify-otp', {
        name: user.name,
        otp: user.otp,
        appName: APP_NAME
    })

    res.jsonify({
        message: 'Đăng ký tài khoản thành công. Vui lòng kiểm tra email để lấy mã xác thực.',
        email: user.email
    })
}

export async function verifyOTP(req, res) {
    const user = await authService.verifyOTP(req.body)
    res.jsonify({
        message: 'Xác thực tài khoản thành công. Bạn có thể đăng nhập ngay bây giờ.',
        user
    })
}

export async function logout(req, res) {
    const token = getToken(req.headers)
    await authService.blockToken(token)
    res.jsonify('Đăng xuất thành công.')
}

// eslint-disable-next-line require-await
export const googleAuth = async (req, res) => {
    const oauth2Client = new google.auth.OAuth2(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        GOOGLE_CALLBACK_URL
    )

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    })

    res.redirect(url)
}

export async function googleCallback(req, res) {
    const { code } = req.query
    const oauth2Client = new google.auth.OAuth2(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        GOOGLE_CALLBACK_URL
    )
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    const oauth2 = google.oauth2({
        auth: oauth2Client,
        version: 'v2'
    })

    const { data } = await oauth2.userinfo.get()

    const user = await authService.findOrCreateUserByGoogle(data)
    const tokenData = authService.authTokenUser(user)

    // Redirect về client kèm tokens.
    const urlClient = new URL(`${APP_URL_CLIENT}/login-success`)
    urlClient.searchParams.append('access_token', tokenData.access_token)
    urlClient.searchParams.append('refresh_token', tokenData.refresh_token)
    urlClient.searchParams.append('expire_in', tokenData.expire_in)

    res.redirect(urlClient.toString())
}

export async function refreshToken(req, res) {
    const { refresh_token } = req.body
    if (!refresh_token) {
        abort(400, 'Refresh token không được bỏ trống.')
    }
    const tokenData = await authService.refreshUserToken(refresh_token)
    res.jsonify(tokenData)
}
