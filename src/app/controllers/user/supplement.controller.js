import SupplementService from '@/app/services/staff/supplement.service.js'

// Lấy danh sách yêu cầu bổ sung của User đang đăng nhập
export const getMyRequests = async (req, res) => {
    try {
        const userId = req.currentUser._id
        const data = await SupplementService.getUserRequests(userId)
        res.json({
            success: true,
            data
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

// User nộp phản hồi bổ sung
export const submitResponse = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.currentUser._id
        console.log('Submit Response Hit:', { id, userId })
        const data = await SupplementService.submitResponse(id, userId, req.body)
        res.json({
            success: true,
            data,
            message: 'Đã gửi phản hồi bổ sung hồ sơ'
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}
