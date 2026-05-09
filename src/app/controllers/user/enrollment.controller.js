import UserEnrollmentService from '@/app/services/user-enrollment.service.js'

export const getSummary = async (req, res) => {
    try {
        const userId = req.currentUser._id
        const data = await UserEnrollmentService.getSummary(userId)
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

export const submitApplication = async (req, res) => {
    try {
        const userId = req.currentUser._id
        await UserEnrollmentService.submitApplication(userId)
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
