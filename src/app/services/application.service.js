import Application from '@/models/application.js'
import Round from '@/models/round.js'
import Major from '@/models/major.js'
import Score from '@/models/score.js'
import AdmissionResult from '@/models/admission-result.js'
import NotificationService from '@/app/services/notification.service.js'

class ApplicationService {
    async create(userId, data) {
        const { round_id, university_id, major_id, aspiration_order, method, combination } = data

        const round = await Round.findById(round_id)
        if (!round) throw new Error('Không tìm thấy đợt tuyển sinh')
        if (round.status !== 'open') throw new Error('Đợt tuyển sinh đã đóng, không thể đăng ký')

        const exists = await Application.findOne({ user_id: userId, round_id, major_id })
        if (exists) throw new Error('Bạn đã đăng ký ngành này trong đợt tuyển sinh này')

        const score = await Score.findOne({ user_id: userId })
        let totalScore = 0
        let bestCombination = combination || ''

        if (score) {
            if (combination && score.combinations && score.combinations[combination]) {
                totalScore = Number(score.combinations[combination])
            } else if (score.combinations && Object.keys(score.combinations).length > 0) {
                const major = await Major.findById(major_id)
                const majorGroups = major?.groups || []

                for (const [comb, pts] of Object.entries(score.combinations)) {
                    if (majorGroups.length === 0 || majorGroups.includes(comb)) {
                        if (Number(pts) > totalScore) {
                            totalScore = Number(pts)
                            bestCombination = comb
                        }
                    }
                }
            }

            if (totalScore === 0) {
                totalScore = score.average || 0
            }
        }

        const application = await Application.create({
            user_id: userId,
            round_id,
            university_id,
            major_id,
            aspiration_order,
            score: totalScore,
            method: method || '',
            combination: bestCombination,
            status: 'pending'
        })

        return application
    }

    async getMyApplications(userId, roundId) {
        const filter = { user_id: userId }
        if (roundId) filter.round_id = roundId

        return await Application.find(filter)
            .populate('university_id major_id round_id')
            .sort({ round_id: -1, aspiration_order: 1 })
    }

    async getMyResult(userId, roundId) {
        if (!roundId) throw new Error('Vui lòng chọn đợt tuyển sinh')

        const round = await Round.findById(roundId)
        if (!round) throw new Error('Không tìm thấy đợt tuyển sinh')
        if (round.status !== 'result_published') {
            throw new Error('Kết quả chưa được công bố')
        }

        const applications = await Application.find({ user_id: userId, round_id: roundId })
            .populate('university_id major_id round_id')
            .sort({ aspiration_order: 1 })

        const results = []
        for (const app of applications) {
            const admissionResult = await AdmissionResult.findOne({
                round_id: roundId,
                major_id: app.major_id._id || app.major_id
            })

            results.push({
                application: app,
                admissionResult: admissionResult || null
            })
        }

        return results
    }

    async confirmAdmission(userId, applicationId) {
        const application = await Application.findOne({ _id: applicationId, user_id: userId })
        if (!application) throw new Error('Không tìm thấy hồ sơ')

        if (application.status !== 'passed') {
            throw new Error('Chỉ có thể xác nhận nhập học với hồ sơ đã đỗ')
        }

        if (application.is_confirmed) {
            throw new Error('Bạn đã xác nhận nhập học rồi')
        }

        const round = await Round.findById(application.round_id)
        if (!round || round.status !== 'result_published') {
            throw new Error('Kết quả chưa được công bố')
        }

        application.is_confirmed = true
        application.confirmed_at = new Date()
        await application.save()

        return application
    }

    async deleteApplication(userId, applicationId) {
        const application = await Application.findOne({ _id: applicationId, user_id: userId })
        if (!application) throw new Error('Không tìm thấy hồ sơ')

        const round = await Round.findById(application.round_id)
        if (!round || round.status !== 'open') {
            throw new Error('Đợt tuyển sinh đã đóng, không thể hủy đăng ký')
        }

        if (application.status !== 'pending') {
            throw new Error('Hồ sơ đã được xử lý, không thể hủy')
        }

        return await Application.findByIdAndDelete(applicationId)
    }
}

export default new ApplicationService()
