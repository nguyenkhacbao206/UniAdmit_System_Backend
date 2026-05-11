import User from '@/models/user.js'
import Profile from '@/models/profile.js'
import Preference from '@/models/preference.js'
import Invoice from '@/models/invoice.js'
import Score from '@/models/score.js'
import Enrollment from '@/models/enrollment.js'

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
    async getSummary(userId) {
        const user = await User.findById(userId)
        const profile = await Profile.findOne({ user_id: userId })
        const preferences = await Preference.find({ userId })
            .populate('university major admissionMethod')
            .sort({ priority: 1 })
        const score = await Score.findOne({ user_id: userId })
        
        // Sửa lỗi query field name: userId thay vì user_id
        const invoice = await Invoice.findOne({ userId }).sort({ createdAt: -1 })

        // Logic tìm tổ hợp môn tốt nhất để hiển thị ở frontend
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
            preferences,
            score,
            invoice,
            bestCombination
        }
    }

    async submit(userId) {
        const user = await User.findById(userId)
        if (user.isSubmitted) {
            throw new Error('Hồ sơ đã được nộp trước đó')
        }

        const profile = await Profile.findOne({ user_id: userId })
        if (!profile || !profile.cccd) {
            throw new Error('Vui lòng hoàn thiện hồ sơ cá nhân')
        }

        if (!user.isConfirmed) {
            throw new Error('Vui lòng xác nhận danh sách nguyện vọng')
        }

        const invoice = await Invoice.findOne({ userId, status: 'paid' })
        if (!invoice) {
            throw new Error('Vui lòng thanh toán lệ phí tuyển sinh')
        }

        const preferences = await Preference.find({ userId })
        if (preferences.length === 0) {
            throw new Error('Chưa có nguyện vọng nào để nộp')
        }

        // Finalize preferences
        const now = new Date()
        const score = await Score.findOne({ user_id: userId })
        
        let bestPoints = score?.average || 0
        let bestCombName = ''

        if (score && score.combinations) {
            // Find the highest score among combinations
            Object.entries(score.combinations).forEach(([comb, pts]) => {
                if (pts > bestPoints) {
                    bestPoints = pts
                    bestCombName = comb
                }
            })
        }

        for (const pref of preferences) {
            if (!pref.applicationCode) {
                const count = await Preference.countDocuments({ applicationCode: { $exists: true } })
                pref.applicationCode = `APP${(count + 1).toString().padStart(3, '0')}`
            }
            pref.status = 'pending'
            pref.submittedAt = now
            pref.points = bestPoints
            pref.combination = bestCombName
            await pref.save()
        }

        // Update user status
        user.isSubmitted = true
        await user.save()

        return true
    }
}

export default new EnrollmentService()