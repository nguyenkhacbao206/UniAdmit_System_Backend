import User from '@/models/user.js'
import Profile from '@/models/profile.js'
import Invoice from '@/models/invoice.js'
import Score from '@/models/score.js'
import Enrollment from '@/models/enrollment.js'
import Application from '@/models/application.js'
import Round from '@/models/round.js'

class EnrollmentService {
    // Admin
    async createEnrollmentService(data) {
        return await Enrollment.create(data)
    }

    async getEnrollmentService() {
        return await Enrollment.find({}).sort({ createdAt: -1 })
    }

    async getEnrollmentByPages(page = 1, limit = 10) {
        const total = await Enrollment.countDocuments({})
        const data = await Enrollment.find({})
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)

        return {
            enrollment: data,
            total
        }
    }

    async getEnrollmentBySearch(data) {
        const q = data.q || ''
        return await Enrollment.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { code: { $regex: q, $options: 'i' } }
            ]
        })
    }

    async getEnrollmentByIdService(id) {
        return await Enrollment.findById(id)
    }

    async updateEnrollment(id, data) {
        return await Enrollment.findByIdAndUpdate(id, data, { new: true })
    }

    async deleteEnrollment(id) {
        return await Enrollment.findByIdAndDelete(id)
    }

    // User
    async getSummary(userId, roundId) {
        const user = await User.findById(userId)
        const profile = await Profile.findOne({ user_id: userId })
        const score = await Score.findOne({ user_id: userId })

        let round = null
        let applications = []
        let invoice = null

        if (roundId) {
            round = await Round.findById(roundId)
            applications = await Application.find({ user_id: userId, round_id: roundId })
                .populate('university_id major_id')
                .sort({ aspiration_order: 1 })
            invoice = await Invoice.findOne({ userId, round_id: roundId }).sort({ createdAt: -1 })
        }

        let bestCombination = null
        if (score && score.combinations) {
            const COMBINATIONS_CONFIG = {
                'A00': ['math', 'physics', 'chemistry'],
                'A01': ['math', 'physics', 'english'],
                'B00': ['math', 'chemistry', 'biology'],
                'C00': ['literature', 'history', 'geography'],
                'D01': ['math', 'literature', 'english'],
                'D07': ['math', 'chemistry', 'english'],
                'C01': ['literature', 'math', 'physics'],
                'C02': ['literature', 'math', 'chemistry'],
                'C03': ['literature', 'math', 'history'],
                'D09': ['math', 'history', 'english'],
                'D10': ['math', 'geography', 'english'],
            }

            const subjectNames = {
                math: 'Toán',
                physics: 'Lý',
                chemistry: 'Hóa',
                literature: 'Văn',
                english: 'Anh',
                biology: 'Sinh',
                history: 'Sử',
                geography: 'Địa',
                civic_education: 'GDCD'
            }

            let maxScore = -1
            let bestBlock = ''

            for (const [block, value] of Object.entries(score.combinations)) {
                if (value > maxScore) {
                    maxScore = value
                    bestBlock = block
                }
            }

            if (bestBlock) {
                const subjects = COMBINATIONS_CONFIG[bestBlock] || []
                const names = subjects.map(s => subjectNames[s]).join(', ')
                bestCombination = {
                    block: bestBlock,
                    score: maxScore,
                    subjects: names
                }
            }
        }

        return {
            user,
            profile,
            applications,
            round,
            score,
            invoice,
            bestCombination,
            feeConfig: round ? {
                feePerPreference: round.feePerPreference || 20000,
                serviceFee: round.serviceFee || 20000
            } : null
        }
    }

    async submit(userId, roundId) {
        if (!roundId) throw new Error('Vui lòng chọn đợt xét tuyển')

        const round = await Round.findById(roundId)
        if (!round) throw new Error('Không tìm thấy đợt xét tuyển')

        const profile = await Profile.findOne({ user_id: userId })
        if (!profile || !profile.cccd) {
            throw new Error('Vui lòng hoàn thiện hồ sơ cá nhân')
        }

        const applications = await Application.find({ user_id: userId, round_id: roundId })
        if (applications.length === 0) {
            throw new Error('Chưa có nguyện vọng nào trong đợt này')
        }

        const existingSubmitted = await Invoice.findOne({ userId, round_id: roundId, isSubmitted: true })
        if (existingSubmitted) {
            throw new Error('Hồ sơ đợt này đã được nộp trước đó')
        }

        const preferenceCount = applications.length
        const admissionFee = preferenceCount * (round.feePerPreference || 20000)
        const serviceFee = round.serviceFee || 20000
        const totalAmount = admissionFee + serviceFee

        let invoice = await Invoice.findOne({ userId, round_id: roundId })
        if (invoice) {
            invoice.preferenceCount = preferenceCount
            invoice.admissionFee = admissionFee
            invoice.serviceFee = serviceFee
            invoice.totalAmount = totalAmount
            invoice.isSubmitted = true
            invoice.submittedAt = new Date()
            await invoice.save()
        } else {
            invoice = await Invoice.create({
                userId,
                round_id: roundId,
                preferenceCount,
                admissionFee,
                serviceFee,
                totalAmount,
                status: 'pending',
                isSubmitted: true,
                submittedAt: new Date()
            })
        }

        return true
    }
}

export default new EnrollmentService()