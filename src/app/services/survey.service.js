import SurveyQuestion from '@/models/surveyQuestion'
import SurveyOption from '@/models/surveyOption'
import UserSurveyResult from '@/models/userSurveyResult'
import Major from '@/models/major'

class SurveyService {

    async createQuestion(data, staffId) {
        return await SurveyQuestion.create({
            ...data,
            createdBy: staffId,
            status: 'pending' // Flow: Staff create -> Pending -> Admin approve
        })
    }

    async updateQuestion(id, data) {
        return await SurveyQuestion.findByIdAndUpdate(id, data, { new: true })
    }

    async deleteQuestion(id) {
        // Also delete options related to this question
        await SurveyOption.deleteMany({ questionId: id })
        return await SurveyQuestion.findByIdAndDelete(id)
    }

    async addOptionToQuestion(questionId, optionData) {
        return await SurveyOption.create({
            ...optionData,
            questionId
        })
    }

    async updateOption(optionId, data) {
        return await SurveyOption.findByIdAndUpdate(optionId, data, { new: true })
    }

    async getAllQuestions() {
        return await SurveyQuestion.find()
            .populate('options')
            .sort({ order: 1 })
    }

    // admin approve question

    async approveQuestion(id) {
        return await SurveyQuestion.findByIdAndUpdate(id, { status: 'published' }, { new: true })
    }

    //  User Actions 

    async getPublishedQuestions() {
        return await SurveyQuestion.find({ status: 'published' })
            .populate('options')
            .sort({ order: 1 })
    }

    async submitSurvey(userId, answers) {
        // answers: [{ questionId, optionId }]

        const majorScoresMap = {} // { majorId: score }

        for (const ans of answers) {
            const option = await SurveyOption.findById(ans.optionId)
            if (option) {
                for (const mapping of option.scores) {
                    const mid = mapping.majorId.toString()
                    majorScoresMap[mid] = (majorScoresMap[mid] || 0) + mapping.score
                }
            }
        }

        // Convert map to array and sort
        const majorScoresArray = Object.entries(majorScoresMap).map(([majorId, totalScore]) => ({
            majorId,
            totalScore
        })).sort((a, b) => b.totalScore - a.totalScore)

        if (majorScoresArray.length === 0) {
            throw new Error('Không thể xác định kết quả. Vui lòng thử lại.')
        }

        const bestMatch = majorScoresArray[0]

        // Match percentage calculation
        const matchPercentage = Math.min(100, (bestMatch.totalScore / (answers.length * 3)) * 100)

        const result = await UserSurveyResult.create({
            userId,
            majorScores: majorScoresArray,
            suggestedMajorId: bestMatch.majorId,
            matchPercentage: Math.round(matchPercentage),
            answers
        })

        return await UserSurveyResult.findById(result._id).populate('suggestedMajor')
    }

    async getResultsHistory(userId) {
        return await UserSurveyResult.find({ userId })
            .populate('suggestedMajor')
            .sort({ createdAt: -1 })
    }

    async getStats() {
        const totalUser = await UserSurveyResult.countDocuments()
        const suggestedStats = await UserSurveyResult.aggregate([
            { $group: { _id: '$suggestedMajorId', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ])

        return {
            totalUser,
            topSuggested: suggestedStats
        }
    }
}

export default new SurveyService()
