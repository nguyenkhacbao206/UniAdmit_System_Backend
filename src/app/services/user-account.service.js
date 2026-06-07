import { User, STATUS_ACCOUNT } from '@/models'
import { abort } from '@/utils/helpers'
import { tokenBlocklist } from '@/app/services/auth.service'

// Đổi mật khẩu: bắt buộc đúng mật khẩu hiện tại trước khi đặt cái mới.
export async function changePassword(userId, { currentPassword, newPassword }) {
    if (!currentPassword) abort(400, 'Vui lòng nhập mật khẩu hiện tại')
    if (!newPassword || String(newPassword).length < 6) {
        abort(400, 'Mật khẩu mới phải có ít nhất 6 ký tự')
    }
    if (currentPassword === newPassword) {
        abort(400, 'Mật khẩu mới không được trùng mật khẩu cũ')
    }

    const user = await User.findOne({ _id: userId, deleted: false })
    if (!user) abort(404, 'Không tìm thấy tài khoản')

    if (!user.verifyPassword(currentPassword)) {
        abort(400, 'Mật khẩu hiện tại không đúng')
    }

    // Setter hash mật khẩu ở model
    user.password = newPassword
    await user.save()
    return { _id: user._id }
}

export async function getPreferences(userId) {
    const user = await User.findOne({ _id: userId, deleted: false })
        .select('notification_preferences language')
        .lean()
    if (!user) abort(404, 'Không tìm thấy tài khoản')
    return {
        notification_preferences: user.notification_preferences || {
            resultUpdates: true,
            applicationReminders: true,
            paymentReminders: true,
            pushNotifications: false,
        },
        language: user.language || 'vi',
    }
}

export async function updatePreferences(userId, patch) {
    const allowed = ['resultUpdates', 'applicationReminders', 'paymentReminders', 'pushNotifications']
    const updates = {}
    for (const key of allowed) {
        if (typeof patch?.[key] === 'boolean') {
            updates[`notification_preferences.${key}`] = patch[key]
        }
    }
    if (!Object.keys(updates).length) abort(400, 'Không có thay đổi nào để cập nhật')

    const user = await User.findOneAndUpdate(
        { _id: userId, deleted: false },
        { $set: updates },
        { new: true }
    ).select('notification_preferences')
    if (!user) abort(404, 'Không tìm thấy tài khoản')
    return user.notification_preferences
}

export async function updateLanguage(userId, language) {
    if (!['vi', 'en'].includes(language)) abort(400, 'Ngôn ngữ không hợp lệ')
    const user = await User.findOneAndUpdate(
        { _id: userId, deleted: false },
        { $set: { language } },
        { new: true }
    ).select('language')
    if (!user) abort(404, 'Không tìm thấy tài khoản')
    return { language: user.language }
}

// Vô hiệu hóa tài khoản: status='INACTIVE'. Có thể mở lại bằng cách đăng nhập
// (luồng login đang để mở; nếu muốn chặn hoàn toàn, controller login cần check
// status). Ở đây ta vô hiệu hóa token hiện tại để bắt user đăng nhập lại nếu
// muốn dùng tiếp.
export async function disableAccount(userId, currentToken) {
    const user = await User.findOne({ _id: userId, deleted: false })
    if (!user) abort(404, 'Không tìm thấy tài khoản')

    user.status = STATUS_ACCOUNT.INACTIVE
    await user.save()

    if (currentToken) {
        try { await tokenBlocklist.set(currentToken, true) } catch { /* ignore */ }
    }
    return { _id: user._id, status: user.status }
}

// Xóa vĩnh viễn: soft-delete để giữ lại lịch sử cho hệ thống.
export async function deleteAccount(userId, currentToken) {
    const user = await User.findOne({ _id: userId, deleted: false })
    if (!user) abort(404, 'Không tìm thấy tài khoản')

    user.deleted = true
    user.status = STATUS_ACCOUNT.INACTIVE
    await user.save()

    if (currentToken) {
        try { await tokenBlocklist.set(currentToken, true) } catch { /* ignore */ }
    }
    return { _id: user._id }
}
