import * as StaffService from '@/app/services/staff.service'


export const createStaffController = async (req, res) => {
    try {
        const data = req.body
        const staff = await StaffService.createStaffService(data)
        return res.json({
            success: true,
            message: 'Thêm nhân viên thành công',
            data: staff
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống',
        })
    }
}


export const getStaffController = async (req, res) => {
    try {
        const staff = await StaffService.getStaffService()
        return res.json({
            success: true,
            message: 'Lấy danh sách nhân viên thành công',
            data: staff
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống',
        })
    }
}

export const getStaffByIdController = async (req, res) => {
    try {
        const { id } = req.params
        const staff = await StaffService.getStaffByIdService(id)
        return res.json({
            success: true,
            message: 'Lấy thông tin nhân viên thành công',
            data: staff
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống',
        })
    }
}

export const updateStaffController = async (req, res) => {
    try {
        const { id } = req.params
        const data = req.body
        const staff = await StaffService.updateStaffService(id, data)
        return res.json({
            success: true,
            message: 'Cập nhật thông tin nhân viên thành công',
            data: staff
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống',
        })
    }
}

export const deleteStaffController = async (req, res) => {
    try {
        const { id } = req.params
        const staff = await StaffService.deleteStaffService(id)
        return res.json({
            success: true,
            message: 'Xóa nhân viên thành công',
            data: staff
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống',
        })
    }
}

export const getStaffBySearchController = async (req, res) => {
    try {
        const data = req.body
        const staff = await StaffService.getStaffBySearchService(data)
        return res.json({
            success: true,
            message: 'Tìm kiếm nhân viên thành công',
            data: staff
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống',
        })
    }
}

export const getStaffByPagesController = async (req, res) => {
    try {
        const data = req.body
        const staff = await StaffService.getStaffByPagesService(data)
        return res.json({
            success: true,
            message: 'Lấy danh sách nhân viên theo trang thành công',
            data: staff
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống',
        })
    }
}