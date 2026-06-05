import Application from '@/models/application.js'
import Round from '@/models/round.js'
import Major from '@/models/major.js'
import Score from '@/models/score.js'
import AdmissionResult from '@/models/admission-result.js'
import Invoice from '@/models/invoice.js'

// Single source of truth: a round only accepts new aspirations/edits when BOTH
// (a) admin status is 'open' AND (b) the current time is still within the registration window.
// An expired endDate makes the round effectively closed even if admin forgot to flip status.
const assertRoundOpenForRegistration = (round) => {
    if (!round) throw new Error('Không tìm thấy đợt tuyển sinh')
    if (round.status !== 'open') {
        throw new Error('Đợt tuyển sinh đã đóng, không thể đăng ký')
    }
    if (round.endDate && new Date() > new Date(round.endDate)) {
        throw new Error('Đợt tuyển sinh đã hết hạn, không thể đăng ký')
    }
    if (round.startDate && new Date() < new Date(round.startDate)) {
        throw new Error('Đợt tuyển sinh chưa mở, vui lòng quay lại sau')
    }
}

class ApplicationService {
    async create(userId, data) {
        const { round_id, university_id, major_id, aspiration_order, method, combination } = data

        const round = await Round.findById(round_id)
        assertRoundOpenForRegistration(round)

        const submittedInvoice = await Invoice.findOne({ userId, round_id, isSubmitted: true })
        if (submittedInvoice) throw new Error('Đợt này đã nộp hồ sơ, không thể thêm nguyện vọng')

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

    async reorder(userId, list) {
        if (!Array.isArray(list) || list.length === 0) {
            throw new Error('Danh sách sắp xếp không hợp lệ')
        }

        const ids = list.map((item) => item.id).filter(Boolean)
        const apps = await Application.find({ _id: { $in: ids }, user_id: userId })
        if (apps.length !== ids.length) {
            throw new Error('Một số nguyện vọng không thuộc về bạn hoặc không tồn tại')
        }

        // Check every round involved is still accepting edits
        const uniqueRoundIds = [...new Set(apps.map((a) => String(a.round_id)))]
        const rounds = await Round.find({ _id: { $in: uniqueRoundIds } })
        for (const round of rounds) {
            assertRoundOpenForRegistration(round)
        }

        const submitted = await Invoice.findOne({
            userId,
            round_id: { $in: apps.map((a) => a.round_id) },
            isSubmitted: true,
        })
        if (submitted) {
            throw new Error('Đợt này đã nộp hồ sơ, không thể sắp xếp lại')
        }

        await Promise.all(
            list.map((item) =>
                Application.updateOne(
                    { _id: item.id, user_id: userId },
                    { $set: { aspiration_order: Number(item.aspiration_order ?? item.priority ?? 0) } }
                )
            )
        )

        return { updated: list.length }
    }

    async deleteApplication(userId, applicationId) {
        const application = await Application.findOne({ _id: applicationId, user_id: userId })
        if (!application) throw new Error('Không tìm thấy hồ sơ')

        const round = await Round.findById(application.round_id)
        assertRoundOpenForRegistration(round)

        const submittedInvoice = await Invoice.findOne({ userId, round_id: application.round_id, isSubmitted: true })
        if (submittedInvoice) throw new Error('Đợt này đã nộp hồ sơ, không thể hủy nguyện vọng')

        if (application.status !== 'pending') {
            throw new Error('Hồ sơ đã được xử lý, không thể hủy')
        }

        return await Application.findByIdAndDelete(applicationId)
    }
}

export default new ApplicationService()
