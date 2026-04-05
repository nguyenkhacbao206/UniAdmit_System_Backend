import * as enrollmentService from '@/app/services/enrollment.service'


export const createEnollmentController = async (req, res) => {
    try {
        const data = req.body
        const createData = await enrollmentService.createEnrollmentService(data)

        const result = res.status(200).json({
            success: true,
            message: 'Tạo đợi tuyển sinh',
            data: createData
        })

        return result
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'lỗi server',

        })
    }

}

export const getEnrollmentController = async (req, res) => {
    try {
        const getData = await enrollmentService.getEnrollmentService()
        const result = res.status(200).json({
            success: true,
            message: 'lấy danh sách tuyển sinh thành công',
            data: getData
        })

        return result
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'lỗi server',
        })
    }
}

export const getEnrollmentByIdController = async (req, res) => {
    try {
        const id = req.params.id
        const getDataById = await enrollmentService.getEnrollmentByIdService(id)
        const result = res.status(200).json({
            success: true,
            message: 'lấy thông tin tuyển sinh thành công',
            data: getDataById
        })

        return result
    } catch (err) {
        res.status(500).json({
            success: false,
            messgae: err.message || 'Lỗi server'
        })
    }
}

export const updateEnrollmentController = async (req, res) => {
    try {
        const id = req.params.id
        const data = req.body

        const updateData = await enrollmentService.updateEnrollment(id, data)
        const result = res.status(200).json({
            success: true,
            message: 'Cập nhật thành công đợt tuyển sinh',
            data: updateData
        })

        return result
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'Lỗi server'
        })
    }
}

export const deleteEnrollmentController = async (req, res) => {
    try {
        const id = req.params.id
        const deleteData = await enrollmentService.deleteEnrollment(id)
        const result = res.status(200).json({
            success: true,
            message: 'Xóa thành công đợt tuyển sinh',
            data: deleteData

        })

        return result
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'Lỗi server'
        })
    }
}

export const getEnrollmentBySearchController = async (req, res) => {
    try {
        const data = req.query
        const searchData = await enrollmentService.getEnrollmentBySearch(data)

        const result = res.status(200).json({
            success: true,
            message: 'search thành công',
            data: searchData
        })

        return result
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'Lỗi server'
        })
    }
}

export const getEnrollmentByPage = async (req, res) => {
    try {
        const { page, limit } = req.query

        const enrollmentPage = await enrollmentService.getEnrollmentByPages(
            page,
            limit
        )

        const result = res.status(200).json({
            success: true,
            message: '',
            data: enrollmentPage
        })

        return result
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || 'Lỗi server'
        })
    }
}