import { Admin } from '@/models'
import { abort } from '@/utils/helpers'

export const getStaffs = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query
        const query = { 
            deleted: false,
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ]
        }
        
        const staffs = await Admin.find(query)
            .populate('roles')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 })

        const count = await Admin.countDocuments(query)

        return res.json({
            success: true,
            data: {
                result: staffs,
                total: count
            }
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'Lỗi server'
        })
    }
}

export const createStaff = async (req, res) => {
    try {
        const { name, email, phone, password, role_ids } = req.body

        // Check duplicate
        const existing = await Admin.findOne({ 
            $or: [{ email: email.toLowerCase() }, { phone }],
            deleted: false 
        })
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Email hoặc số điện thoại đã tồn tại trên hệ thống.'
            })
        }

        const newStaff = await Admin.create({
            name,
            email: email.toLowerCase(),
            phone,
            password, // Password will be hashed by model setter
            role_ids,
            status: 'active'
        })

        return res.status(201).json({
            success: true,
            message: 'Tạo tài khoản cán bộ thành công',
            data: newStaff
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'Lỗi server'
        })
    }
}

export const updateStaff = async (req, res) => {
    try {
        const { id } = req.params
        const { name, email, phone, password, role_ids, status } = req.body

        const staff = await Admin.findOne({ _id: id, deleted: false })
        if (!staff) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy tài khoản cán bộ.'
            })
        }

        if (name) staff.name = name
        if (email) staff.email = email.toLowerCase()
        if (phone) staff.phone = phone
        if (password) staff.password = password
        if (role_ids) staff.role_ids = role_ids
        if (status) staff.status = status

        await staff.save()

        return res.json({
            success: true,
            message: 'Cập nhật tài khoản cán bộ thành công',
            data: staff
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'Lỗi server'
        })
    }
}

export const deleteStaff = async (req, res) => {
    try {
        const { id } = req.params
        const staff = await Admin.findOne({ _id: id, deleted: false })
        
        if (!staff) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy tài khoản cán bộ.'
            })
        }

        if (staff.is_protected) {
            return res.status(403).json({
                success: false,
                message: 'Không thể xóa tài khoản hệ thống này.'
            })
        }

        staff.deleted = true
        await staff.save()

        return res.json({
            success: true,
            message: 'Xóa tài khoản cán bộ thành công'
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'Lỗi server'
        })
    }
}
