import EnrollmentService from '@/app/services/enrollment.service'

export const getSummary = async (req, res) => {
    try {
        const userId = req.currentUser._id
        const data = await EnrollmentService.getSummary(userId)
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
        await EnrollmentService.submit(userId)
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
