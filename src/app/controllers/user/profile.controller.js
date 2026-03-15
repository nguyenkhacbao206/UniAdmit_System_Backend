import * as userService from '@/app/services/user.service'
import { abort } from '@/utils/helpers'
import FileUpload from '@/utils/classes/file-upload'

export async function getProfile(req, res) {
    const data = await userService.getUserProfile(req.currentUser._id)
    res.jsonify(data)
}

export async function updateProfile(req, res) {
    const updatedData = await userService.updateUserProfile(req.currentUser._id, req.body)
    res.jsonify(updatedData, 'Cập nhật thông tin thành công')
} 

export async function updateAvatar(req, res) {
    const file = req.files?.[0]
    if (!file) abort(400, 'Vui lòng chọn ảnh đại diện')
    
    const fileUpload = new FileUpload(file)
    if (!fileUpload.isImage()) abort(400, 'File không đúng định dạng ảnh')
    
    const avatarPath = await fileUpload.save('avatars')
    const updatedAvatar = await userService.updateAvatar(req.currentUser._id, avatarPath)
    
    res.jsonify({ avatar: updatedAvatar }, 'Cập nhật ảnh đại diện thành công')
}

export async function uploadCV(req, res) {
    const file = req.files?.[0]
    if (!file) abort(400, 'Vui lòng chọn file CV')
    
    const fileUpload = new FileUpload(file)
    // Cho phép PDF, DOC, DOCX
    const allowedMime = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedMime.includes(fileUpload.mimetype)) {
        abort(400, 'File CV phải định dạng PDF hoặc Word')
    }
    
    const cvPath = await fileUpload.save('cvs')
    const updatedCV = await userService.updateCV(req.currentUser._id, cvPath)
    
    res.jsonify({ cv: updatedCV }, 'Tải lên CV thành công')
}
