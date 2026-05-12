import EnrollmentService from '@/app/services/enrollment.service'

export const getSummary = async (req, res) => {
    try {
        const userId = req.currentUser._id
        const { round_id } = req.query
        const data = await EnrollmentService.getSummary(userId, round_id)
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

export const submit = async (req, res) => {
    try {
        const userId = req.currentUser._id
        const { round_id } = req.body
        await EnrollmentService.submit(userId, round_id)
        res.json({
            success: true,
            message: 'Nộp hồ sơ thành công'
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}
