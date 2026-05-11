import SupplementService from '@/app/services/staff/supplement.service.js'

// Lấy danh sách yêu cầu bổ sung
export const getList = async (req, res) => {
    try {
        const data = await SupplementService.getList(req.query)
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

// Tạo yêu cầu bổ sung mới
export const createRequest = async (req, res) => {
    try {
        const staffId = req.currentStaff?._id || req.currentAdmin?._id
        const data = await SupplementService.createRequest(req.body, staffId)
        res.json({
            success: true,
            data,
            message: 'Tạo yêu cầu bổ sung thành công'
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

// Xử lý Phê duyệt / Từ chối bổ sung
export const handleAction = async (req, res) => {
    try {
        const { id } = req.params
        const { action, message } = req.body
        const data = await SupplementService.handleAction(id, action, message)
        res.json({
            success: true,
            data,
            message: action === 'approve' ? 'Đã phê duyệt bổ sung' : 'Đã từ chối bổ sung'
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}
