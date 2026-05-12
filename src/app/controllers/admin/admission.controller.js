import admissionService from '@/app/services/admission.service'

export const runAdmission = async (req, res) => {
    try {
        const { round_id } = req.body

        if (!round_id) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng chọn đợt tuyển sinh'
            })
        }

        const result = await admissionService.runAdmission(round_id)

        return res.status(200).json({
            success: true,
            message: 'Chạy xét tuyển thành công',
            data: result
        })
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message || 'Lỗi server'
        })
    }
}

export const publishResult = async (req, res) => {
    try {
        const { round_id } = req.body
        const adminId = req.currentAdmin._id

        if (!round_id) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng chọn đợt tuyển sinh'
            })
        }

        const result = await admissionService.publishResult(round_id, adminId)

        return res.status(200).json({
            success: true,
            message: 'Công bố kết quả xét tuyển thành công',
            data: result
        })
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message || 'Lỗi server'
        })
    }
}

export const getStatistics = async (req, res) => {
    try {
        const { round_id } = req.query

        if (!round_id) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng chọn đợt tuyển sinh'
            })
        }

        const stats = await admissionService.getStatistics(round_id)

        return res.status(200).json({
            success: true,
            message: 'Lấy thống kê xét tuyển thành công',
            data: stats
        })
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message || 'Lỗi server'
        })
    }
}
