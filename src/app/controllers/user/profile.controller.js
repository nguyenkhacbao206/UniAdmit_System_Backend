import * as userService from '@/app/services/user.service'
import { abort } from '@/utils/helpers'
import FileUpload from '@/utils/classes/file-upload'

export async function getProfile(req, res) {
    const data = await userService.getUserProfile(req.currentUser._id)
    res.jsonify(data)
}

export async function updateProfile(req, res) {
    if (req.body.avatar instanceof FileUpload) {
        req.body.avatar = await req.body.avatar.save('avatars')
    }
    if (req.body.cv instanceof FileUpload) {
        req.body.cv = await req.body.cv.save('cvs')
    }
    const updatedData = await userService.updateUserProfile(req.currentUser._id, req.body)
    res.jsonify(updatedData, 'Cập nhật thông tin thành công')
} 

export async function updateAvatar(req, res) {
    const file = req.body.file || req.body.avatar
    if (!file || !(file instanceof FileUpload)) abort(400, 'Vui lòng chọn ảnh đại diện')
    
    if (!file.isImage()) abort(400, 'File không đúng định dạng ảnh')
    
    const avatarPath = await file.save('avatars')
    const updatedAvatar = await userService.updateAvatar(req.currentUser._id, avatarPath)
    
    res.jsonify({ avatar: updatedAvatar }, 'Cập nhật ảnh đại diện thành công')
}

export async function uploadCV(req, res) {
    const file = req.body.file || req.body.cv
    if (!file || !(file instanceof FileUpload)) abort(400, 'Vui lòng chọn file CV')
    
    // Cho phép PDF, DOC, DOCX
    const allowedMime = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedMime.includes(file.mimetype)) {
        abort(400, 'File CV phải định dạng PDF hoặc Word')
    }
    
    const cvPath = await file.save('cvs')
    const updatedCV = await userService.updateCV(req.currentUser._id, cvPath)
    
    res.jsonify({ cv: updatedCV }, 'Tải lên CV thành công')
}
