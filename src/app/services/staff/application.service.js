import Preference from '@/models/preference.js'
import User from '@/models/user.js'
import Score from '@/models/score.js'
import Profile from '@/models/profile.js'
import AdmissionMethod from '@/models/admission-method.js'

class ApplicationService {
    async getList(query = {}) {
        const { page = 1, limit = 10, search, status, admissionMethod } = query

        // Search logic for users who have submitted
        const userFilter = { isSubmitted: true }
        if (search) {
            userFilter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        }

        // Fetch submitted users
        const users = await User.find(userFilter).sort({ name: 1 })

        const allRows = []

        for (const user of users) {
            const prefFilter = { userId: user._id }
            if (status) prefFilter.status = status
            
            if (admissionMethod && admissionMethod !== 'Tất cả phương thức') {
                // Find admission method ID by name or code if not an ID
                const am = await AdmissionMethod.findOne({
                    $or: [
                        { code: admissionMethod },
                        { methodName: admissionMethod }
                    ]
                })
                if (am) {
                    prefFilter.admissionMethod = am._id
                } else {
                    // If method not found, this user won't have matching preferences
                    continue
                }
            }

            const preferences = await Preference.find(prefFilter)
                .populate('university major admissionMethod')
                .sort({ priority: 1 })

            // Get complete profile and score data
            const profile = await Profile.findOne({ user_id: user._id })
            const score = await Score.findOne({ user_id: user._id })

            // Calculate best score if not stored in preference (for legacy records)
            let bestPoints = 0
            let bestCombName = ''
            
            if (score && score.combinations && Object.keys(score.combinations).length > 0) {
                Object.entries(score.combinations).forEach(([comb, pts]) => {
                    if (Number(pts) > bestPoints) {
                        bestPoints = Number(pts)
                        bestCombName = comb
                    }
                })
            } else {
                bestPoints = score?.average || 0
            }

            preferences.forEach(pref => {
                const finalPoints = pref.points || bestPoints
                const finalComb = pref.combination || bestCombName

                allRows.push({
                    ...pref.toObject(),
                    points: finalPoints,
                    combination: finalComb,
                    student: { 
                        ...user.toObject(),
                        profile: profile?.toObject(),
                        score: score?.toObject()
                    },
                    submittedAt: pref.submittedAt || pref.createdAt
                })
            })
        }

        const total = allRows.length
        const paginatedList = allRows.slice((page - 1) * limit, page * limit)

        return {
            data: paginatedList,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit)
            }
        }
    }

    async updateStatus(id, status) {
        return await Preference.findByIdAndUpdate(id, { status }, { new: true })
    }
}

export default new ApplicationService()
