import SurveyService from '@/app/services/survey.service'

export const approveQuestion = async (req, res) => {
    try {
        const { id } = req.params
        const question = await SurveyService.approveQuestion(id)
        res.json({
            success: true,
            message: 'Đã phê duyệt câu hỏi',
            data: question
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}
