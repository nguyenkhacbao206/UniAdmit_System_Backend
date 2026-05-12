import PreferenceService from '@/app/services/preference.service.js'


export const getList = async (req, res) => {
    try {
        const userId = req.currentUser._id

        const data = await PreferenceService.getByUser(userId)

        res.json({
            success: true,
            isConfirmed: req.currentUser.isConfirmed,
            data
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}


export const add = async (req, res) => {
    try {
        const userId = req.currentUser._id

        const data = await PreferenceService.addPreference(
            userId,
            req.body
        )

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


export const remove = async (req, res) => {
    try {
        const userId = req.currentUser._id
        const { id } = req.params

        await PreferenceService.deletePreference(userId, id)

        res.json({
            success: true,
            message: 'Xóa thành công'
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}


export const reorder = async (req, res) => {
    try {
        const userId = req.currentUser._id
        const { list } = req.body

        await PreferenceService.reorder(userId, list)

        res.json({
            success: true,
            message: 'Reorder thành công'
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}


export const confirm = async (req, res) => {
    try {
        const userId = req.currentUser._id

        await PreferenceService.confirm(userId)

        res.json({
            success: true,
            message: 'Đã xác nhận nguyện vọng'
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}


export const unlock = async (req, res) => {
    try {
        const userId = req.currentUser._id

        await PreferenceService.unlock(userId)

        res.json({
            success: true,
            message: 'Đã mở khóa danh sách nguyện vọng'
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}


export const getResult = async (req, res) => {
    try {
        const userId = req.currentUser._id

        const result = await PreferenceService.getResult(userId)

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