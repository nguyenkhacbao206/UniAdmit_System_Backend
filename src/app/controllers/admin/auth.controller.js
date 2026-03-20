import { abort, getToken } from '@/utils/helpers'
import * as authService from '@/app/services/auth.service'

export async function login(req, res) {
    const validLogin = await authService.checkValidLoginAdmin(req.body)

    if (!validLogin) {
        abort(400, 'Số điện thoại hoặc mật khẩu không đúng.')
    }

    const tokenData = authService.authToken(validLogin)

    //  Lưu refresh token vào cookie (httpOnly)
    res.cookie('refreshToken', tokenData.refresh_token, {
        httpOnly: true,
        secure: false, // dev thì false, production -> true
        sameSite: 'Lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    //  Trả access token cho frontend
    res.jsonify({
        access_token: tokenData.access_token,
        expire_in: tokenData.expire_in,
        auth_type: tokenData.auth_type,
    })
}



export async function logout(req, res) {
    const token = getToken(req.headers)

    if (token) {
        await authService.blockToken(token)
    }

    //  Xoá cookie refresh token
    res.clearCookie('refreshToken')

    res.jsonify('Đăng xuất thành công.')
}



export async function me(req, res) {
    const result = await authService.profileAdmin(req.currentAdmin)
    res.jsonify(result)
}



export async function refreshToken(req, res) {
    //  đúng phải là cookies 
    const refresh_token = req.cookies?.refreshToken

    if (!refresh_token) {
        abort(400, 'Không tìm thấy refresh token.')
    }

    const tokenData = await authService.refreshAdminToken(refresh_token)

    // set lại cookie 
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