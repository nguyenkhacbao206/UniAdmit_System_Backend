import { User } from '@/models'
import { abort } from '@/utils/helpers'

export async function updateUserProfile(userId, profileData) {
    // Kiểm tra nếu cả email và phone đều trống
    if (!profileData.email && !profileData.phone) {
        abort(400, 'Email hoặc số điện thoại là bắt buộc')
    }
    
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: profileData },
            { new: true }
        )
        
        if (!updatedUser) {
            abort(404, 'Không tìm thấy người dùng')
        }
        
        return updatedUser
    } catch (error) {
        abort(500, 'Lỗi khi cập nhật thông tin người dùng')
    }
}

export async function getUserProfile(userId) {
    try {
        const user = await User.findOne({ _id: userId, deleted: false })
        
        if (!user) {
            abort(404, 'Không tìm thấy người dùng')
        }
        
        return user
    } catch (error) {
        abort(500, 'Lỗi khi lấy thông tin người dùng')
    }
} 