import SurveyService from '@/app/services/survey.service'

export const getQuestions = async (req, res) => {
    try {
        const questions = await SurveyService.getPublishedQuestions()
        res.json({
            success: true,
            data: questions
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

export const submitSurvey = async (req, res) => {
    try {
        const userId = req.currentUser._id
        const { answers } = req.body

        if (!answers || !Array.isArray(answers)) {
            return res.status(400).json({
                success: false,
                message: 'Dữ liệu không hợp lệ'
            })
        }

        const result = await SurveyService.submitSurvey(userId, answers)
        res.json({
            success: true,
            data: result
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

export const getResults = async (req, res) => {
    try {
        const userId = req.currentUser._id
        const results = await SurveyService.getResultsHistory(userId)
        res.json({
            success: true,
            data: results
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}
