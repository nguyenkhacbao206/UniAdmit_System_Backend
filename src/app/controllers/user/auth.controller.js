import { google } from 'googleapis'
import { abort, getToken } from '@/utils/helpers'
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL, APP_URL_CLIENT, APP_NAME } from '@/configs'
import * as authService from '@/app/services/auth.service'

export async function login(req, res) {
    const user = await authService.checkValidLoginUser(req.body)

    if (!user) abort(400, 'Tài khoản hoặc mật khẩu không đúng.')

    // Sinh OTP mới + gửi mail. User PHẢI nhập OTP đúng ở bước verifyLoginOTP
    // mới được cấp access token. Account chưa verify thì cùng flow, chỉ khác
    // template + subject email.
    await authService.updateOTP(user)
    const isUnverified = user.status === 'UNVERIFIED'

    const template = isUnverified ? 'emails/verify-otp' : 'emails/login-otp'
    const subject = isUnverified
        ? `[${APP_NAME}] Xác thực tài khoản`
        : `[${APP_NAME}] Xác thực đăng nhập`

    res.sendMail(user.email, subject, template, {
        name: user.name,
        otp: user.otp,
        appName: APP_NAME,
    })

    res.jsonify({
        requires_otp: true,
        ...(isUnverified && { requires_verify: true }),
        email: user.email,
    }, isUnverified
        ? 'Tài khoản chưa được xác thực. Mã OTP đã được gửi đến email của bạn.'
        : 'Vui lòng kiểm tra email để lấy mã xác thực đăng nhập.')
}

export async function verifyLoginOTP(req, res) {
    const user = await authService.verifyOTP(req.body, false) // false vì user đã ACTIVE rồi
    const tokenData = authService.authTokenUser(user)

    // Lưu refresh token vào cookie (httpOnly)
    res.cookie('refreshToken', tokenData.refresh_token, {
        httpOnly: true,
        secure: false, // dev thì false, production -> true
        sameSite: 'Lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    // Trả access token cho frontend
    res.jsonify({
        access_token: tokenData.access_token,
        expire_in: tokenData.expire_in,
        auth_type: tokenData.auth_type,
    }, 'Đăng nhập thành công.')
}

export async function register(req, res) {
    const user = await authService.registerUser(req.body)


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

export async function resendOtp(req, res) {
    const { email } = req.body
    const user = await authService.resendOTP(email)

    // --- TẮT GỬI MAIL ĐỂ TEST (bật lại khi demo) ---
    // res.sendMail(user.email, `[${APP_NAME}] Mã xác thực mới`, 'emails/verify-otp', {
    //     name: user.name,
    //     otp: user.otp,
    //     appName: APP_NAME
    // })

    res.jsonify({
        message: 'Mã xác thực mới đã được gửi vào email của bạn.',
        email: user.email
    })
}

export async function forgotPassword(req, res) {
    const { email } = req.body
    const user = await authService.resendOTP(email)

    // --- TẮT GỬI MAIL ĐỂ TEST (bật lại khi demo) ---
    // res.sendMail(user.email, `[${APP_NAME}] Xác thực quên mật khẩu`, 'emails/forgot-password-otp', {
    //     name: user.name,
    //     otp: user.otp,
    //     appName: APP_NAME
    // })

    res.jsonify({
        message: 'Mã xác thực quên mật khẩu đã được gửi vào email của bạn.',
        email: user.email
    })
}

export async function verifyForgotPasswordOTP(req, res) {
    const user = await authService.verifyOTP(req.body, false)
    res.jsonify({
        message: 'Xác thực mã OTP thành công. Vui lòng đặt lại mật khẩu mới.',
        email: user.email
    })
}

export async function resetPassword(req, res) {
    await authService.resetPassword(req.body)
    res.jsonify('Đặt lại mật khẩu thành công. Bạn có thể đăng nhập bằng mật khẩu mới.')
}

export async function logout(req, res) {
    const token = getToken(req.headers)

    if (token) {
        await authService.blockToken(token)
    }

    // Xoá cookie refresh token
    res.clearCookie('refreshToken')

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

    // Lưu refresh token vào cookie
    res.cookie('refreshToken', tokenData.refresh_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    // Redirect về client chỉ kèm access_token
    const urlClient = new URL(`${APP_URL_CLIENT}/google-oauth-callback`)
    urlClient.searchParams.append('access_token', tokenData.access_token)
    urlClient.searchParams.append('expire_in', tokenData.expire_in)

    res.redirect(urlClient.toString())
}

export async function refreshToken(req, res) {
    // Đọc refresh token từ cookie (httpOnly)
    const refresh_token = req.cookies?.refreshToken

    if (!refresh_token) {
        abort(400, 'Không tìm thấy refresh token.')
    }

    const tokenData = await authService.refreshUserToken(refresh_token)

    // Set lại cookie mới
    res.cookie('refreshToken', tokenData.refresh_token, {
        httpOnly: true,
        secure: false, // dev
        sameSite: 'Lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.jsonify({
        access_token: tokenData.access_token,
        expire_in: tokenData.expire_in,
        auth_type: tokenData.auth_type,
    })
}
