// Controller cho trang "Cài đặt hệ thống" bên user:
// đổi mật khẩu, tùy chọn thông báo, ngôn ngữ, vô hiệu hóa / xóa tài khoản.
import * as accountService from '@/app/services/user-account.service'
import { getToken } from '@/utils/helpers'

export async function changePassword(req, res) {
    const data = await accountService.changePassword(req.currentUser._id, {
        currentPassword: req.body.currentPassword,
        newPassword: req.body.newPassword,
    })
    res.jsonify(data, 'Đổi mật khẩu thành công')
}

export async function getPreferences(req, res) {
    const data = await accountService.getPreferences(req.currentUser._id)
    res.jsonify(data, 'Lấy cài đặt thành công')
}

export async function updatePreferences(req, res) {
    const data = await accountService.updatePreferences(req.currentUser._id, req.body)
    res.jsonify(data, 'Cập nhật cài đặt thông báo thành công')
}

export async function updateLanguage(req, res) {
    const data = await accountService.updateLanguage(req.currentUser._id, req.body?.language)
    res.jsonify(data, 'Cập nhật ngôn ngữ thành công')
}

export async function disableAccount(req, res) {
    const token = getToken(req.headers)
    const data = await accountService.disableAccount(req.currentUser._id, token)
    res.jsonify(data, 'Tài khoản đã được vô hiệu hóa')
}

export async function deleteAccount(req, res) {
    const token = getToken(req.headers)
    const data = await accountService.deleteAccount(req.currentUser._id, token)
    res.jsonify(data, 'Tài khoản đã được xóa')
}
