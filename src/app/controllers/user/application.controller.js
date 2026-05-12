import applicationService from '@/app/services/application.service'

export const create = async (req, res) => {
    try {
        const userId = req.currentUser._id
        const data = req.body

        const application = await applicationService.create(userId, data)

        return res.status(201).json({
            success: true,
            message: 'Đăng ký nguyện vọng thành công',
            data: application
        })
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message || 'Lỗi server'
        })
    }
}

export const getMyApplications = async (req, res) => {
    try {
        const userId = req.currentUser._id
        const { round_id } = req.query

        const applications = await applicationService.getMyApplications(userId, round_id)

        return res.status(200).json({
            success: true,
            message: 'Lấy danh sách nguyện vọng thành công',
            data: applications
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || 'Lỗi server'
        })
    }
}

export const getMyResult = async (req, res) => {
    try {
        const userId = req.currentUser._id
        const { round_id } = req.query

        const results = await applicationService.getMyResult(userId, round_id)

        return res.status(200).json({
            success: true,
            message: 'Lấy kết quả xét tuyển thành công',
            data: results
        })
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message || 'Lỗi server'
        })
    }
}

export const confirmAdmission = async (req, res) => {
    try {
        const userId = req.currentUser._id
        const { applicationId } = req.body

        const application = await applicationService.confirmAdmission(userId, applicationId)

        return res.status(200).json({
            success: true,
            message: 'Xác nhận nhập học thành công',
            data: application
        })
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message || 'Lỗi server'
        })
    }
}

export const deleteApplication = async (req, res) => {
    try {
        const userId = req.currentUser._id
        const { id } = req.params

        await applicationService.deleteApplication(userId, id)

        return res.status(200).json({
            success: true,
            message: 'Hủy đăng ký thành công'
        })
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message || 'Lỗi server'
        })
    }
}
