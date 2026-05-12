import staffAdmissionService from '@/app/services/staff/admission.service'

export const getList = async (req, res) => {
    try {
        const query = req.query
        const result = await staffAdmissionService.getList(query)

        return res.status(200).json({
            success: true,
            message: 'Lấy danh sách hồ sơ xét tuyển thành công',
            data: result.data,
            pagination: result.pagination
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || 'Lỗi server'
        })
    }
}

export const verify = async (req, res) => {
    try {
        const { id } = req.params
        const staffId = req.currentStaff._id

        const application = await staffAdmissionService.verifyApplication(id, staffId)

        return res.status(200).json({
            success: true,
            message: 'Xác minh hồ sơ thành công',
            data: application
        })
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message || 'Lỗi server'
        })
    }
}

export const reject = async (req, res) => {
    try {
        const { id } = req.params
        const staffId = req.currentStaff._id
        const { reason } = req.body

        const application = await staffAdmissionService.rejectApplication(id, staffId, reason)

        return res.status(200).json({
            success: true,
            message: 'Từ chối hồ sơ thành công',
            data: application
        })
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message || 'Lỗi server'
        })
    }
}
