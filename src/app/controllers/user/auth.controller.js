import {abort, getToken} from '@/utils/helpers'
import * as authService from '@/app/services/auth.service'

export async function login(req, res) {
    const validLogin = await authService.checkValidLoginUser(req.body)

    if (validLogin) {
        res.jsonify(authService.authTokenUser(validLogin))
    } else {
        abort(400, 'Tài khoản hoặc mật khẩu không đúng.')
    }
}

export async function register(req, res) {
    const user = await authService.registerUser(req.body)
    res.jsonify({
        message: 'Đăng ký tài khoản thành công',
        user
    })
}

export async function logout(req, res) {
    const token = getToken(req.headers)
    await authService.blockToken(token)
    res.jsonify('Đăng xuất thành công.')
}
