import mongoose from 'mongoose'
import Preference from '@/models/preference.js'
import User from '@/models/user.js'
import Score from '@/models/score.js'
import Major from '@/models/major.js'
// import University from "@/models/universities.js";
// import AdmissionMethod from "@/models/admissionMethod.js";

class PreferenceService {
    async getByUser(userId) {
        return await Preference.find({ userId })
            .sort({ priority: 1 })
            .populate('university major admissionMethod')
    }

    async addPreference(userId, data) {
        const user = await User.findById(userId)
        if (user.isConfirmed) {
            throw new Error('Đã xác nhận, không thể thêm')
        }

        const exists = await Preference.findOne({
            userId,
            major: data.major,
            admissionMethod: data.admissionMethod
        })

        if (exists) {
            throw new Error('Nguyện vọng đã tồn tại')
        }

        const count = await Preference.countDocuments({ userId })

        const preference = await Preference.create({
            ...data,
            userId,
            priority: count + 1
        })

        return preference
    }

    async deletePreference(userId, id) {
        const user = await User.findById(userId)
        if (user.isConfirmed) {
            throw new Error('Đã xác nhận, không thể xóa')
        }

        await Preference.deleteOne({ _id: id, userId })

        const list = await Preference.find({ userId }).sort({ priority: 1 })

        for (let i = 0; i < list.length; i++) {
            list[i].priority = i + 1
            await list[i].save()
        }

        return true
    }

    async reorder(userId, list) {
        const user = await User.findById(userId)
        if (user.isConfirmed) {
            throw new Error('Đã xác nhận, không thể reorder')
        }

        const session = await mongoose.startSession()
        session.startTransaction()

        try {
            for (const item of list) {
                await Preference.updateOne(
                    { _id: item.id, userId },
                    { priority: item.priority },
                    { session }
                )
            }

            await session.commitTransaction()
            session.endSession()

            return true
        } catch (err) {
            await session.abortTransaction()
            session.endSession()
            throw err
        }
    }

    // confirm
    async confirm(userId) {
        const preferences = await Preference.find({ userId })

        if (preferences.length === 0) {
            throw new Error('Chưa có nguyện vọng')
        }

        await User.findByIdAndUpdate(userId, {
            isConfirmed: true
        })

        return true
    }

    // unlock
    async unlock(userId) {
        await User.findByIdAndUpdate(userId, {
            isConfirmed: false
        })

        return true
    }

    async getResult(userId) {
        const user = await User.findById(userId)

        if (!user.isConfirmed) {
            throw new Error('Chưa xác nhận')
        }

        const preferences = await Preference.find({ userId })
            .populate('university major admissionMethod')
            .sort({ priority: 1 })

        const score = await Score.findOne({ userId })

        if (!score) {
            throw new Error('Chưa có điểm')
        }

        const totalScore = score.total

        for (const pref of preferences) {
            const rule = await Major.findOne({
                majorId: pref.major?._id || pref.major,
                admissionMethodId: pref.admissionMethod?._id || pref.admissionMethod
            })

            if (!rule) continue

            if (totalScore >= rule.scoreRequired) {
                return {
                    passed: true,
                    preference: pref
                }
            }
        }

        return {
            passed: false
        }
    }
}

export default new PreferenceService()