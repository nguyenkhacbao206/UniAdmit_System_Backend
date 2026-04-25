import { User, Profile } from '@/models'
import { abort } from '@/utils/helpers'
import _ from 'lodash'

export async function updateUserProfile(userId, profileData) {
    const user = await User.findById(userId)
    if (!user) {
        abort(404, 'Không tìm thấy người dùng')
    }

    // Update thông tin cơ bản ở User (nếu có)
    const userFields = ['name', 'phone', 'email', 'avatar', 'gender', 'dob', 'address']
    const userData = _.omitBy(_.pick(profileData, userFields), (v) => _.isNil(v) || v === '')
    
    if (userData.email && userData.email !== user.email) {
        const existEmail = await User.findOne({ email: userData.email, _id: { $ne: userId }, deleted: false })
        if (existEmail) abort(400, 'Email này đã được sử dụng.')
    }
    
    if (userData.phone && userData.phone !== user.phone) {
        const existPhone = await User.findOne({ phone: userData.phone, _id: { $ne: userId }, deleted: false })
        if (existPhone) abort(400, 'Số điện thoại này đã được sử dụng.')
    }
    
    Object.assign(user, userData)
    await user.save()

    // Update thông tin chi tiết ở Profile
    const profileFields = ['ethnicity', 'gender', 'dob', 'permanentAddress', 'contactAddress', 'cccd', 'place_of_issue', 'avatar', 'cv', 'school', 'score', 'rank']
    const detailData = _.omitBy(_.pick(profileData, profileFields), _.isNil)
    
    let profile = await Profile.findOne({ user_id: userId })
    if (!profile) {
        profile = new Profile({ user_id: userId, name: user.name })
    }
    
    Object.assign(profile, detailData)
    // Đồng bộ name, email, phone sang Profile
    profile.name = user.name
    profile.email = user.email
    profile.phone = user.phone
    profile.avatar = user.avatar
    profile.gender = user.gender
    profile.dob = user.dob
    
    await profile.save()
    
    return {
        ...user.toJSON(),
        profile: profile.toJSON()
    }
}

export async function getUserProfile(userId) {
    const user = await User.findOne({ _id: userId, deleted: false })
    if (!user) {
        abort(404, 'Không tìm thấy người dùng')
    }
    
    let profile = await Profile.findOne({ user_id: userId })
    if (!profile) {
        // Tạo profile mặc định nếu chưa có
        profile = await Profile.create({
            user_id: userId,
            name: user.name,
            email: user.email,
            phone: user.phone
        })
    }
    
    return {
        ...user.toJSON(),
        profile: profile.toJSON()
    }
}

export async function updateAvatar(userId, avatarPath) {
    const user = await User.findById(userId)
    if (!user) abort(404, 'User không tồn tại')
    
    user.avatar = avatarPath
    await user.save()
    
    // Đồng bộ sang Profile (upsert để đảm bảo tạo mới nếu chưa có)
    await Profile.findOneAndUpdate(
        { user_id: userId }, 
        { avatar: avatarPath },
        { upsert: true, new: true }
    )
    
    return user.avatar
}

export async function updateCV(userId, cvPath) {
    const profile = await Profile.findOneAndUpdate(
        { user_id: userId },
        { cv: cvPath },
        { new: true, upsert: true }
    )
    return profile.cv
}
