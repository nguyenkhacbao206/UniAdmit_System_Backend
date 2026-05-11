import ApplicationService from '@/app/services/staff/application.service.js'

export const getList = async (req, res) => {
    try {
        const data = await ApplicationService.getList(req.query)
        res.json({
            success: true,
            ...data
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

export const updateStatus = async (req, res) => {
    try {
        const { id } = req.params
        const { status, message } = req.body
        const staffId = req.currentStaff?._id || req.currentAdmin?._id
        const data = await ApplicationService.updateStatus(id, status, message, staffId)
        res.json({
            success: true,
            data,
            message: 'Cập nhật trạng thái thành công'
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}
