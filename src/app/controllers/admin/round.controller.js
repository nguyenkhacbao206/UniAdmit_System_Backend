import roundService from '@/app/services/round.service'

export const getAll = async (req, res) => {
    try {
        const data = await roundService.getAll()

        return res.status(200).json({
            success: true,
            message: 'Lấy danh sách đợt tuyển sinh thành công',
            data
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || 'Lỗi server'
        })
    }
}

export const getById = async (req, res) => {
    try {
        const { id } = req.params
        const data = await roundService.getById(id)

        return res.status(200).json({
            success: true,
            message: 'Lấy thông tin đợt tuyển sinh thành công',
            data
        })
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message || 'Lỗi server'
        })
    }
}

export const create = async (req, res) => {
    try {
        const data = req.body
        const round = await roundService.create(data)

        return res.status(201).json({
            success: true,
            message: 'Tạo đợt tuyển sinh thành công',
            data: round
        })
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message || 'Lỗi server'
        })
    }
}

export const update = async (req, res) => {
    try {
        const { id } = req.params
        const data = req.body
        const round = await roundService.update(id, data)

        return res.status(200).json({
            success: true,
            message: 'Cập nhật đợt tuyển sinh thành công',
            data: round
        })
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message || 'Lỗi server'
        })
    }
}

export const updateStatus = async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body
        const round = await roundService.updateStatus(id, status)

        return res.status(200).json({
            success: true,
            message: 'Cập nhật trạng thái đợt tuyển sinh thành công',
            data: round
        })
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message || 'Lỗi server'
        })
    }
}

export const remove = async (req, res) => {
    try {
        const { id } = req.params
        await roundService.delete(id)

        return res.status(200).json({
            success: true,
            message: 'Xóa đợt tuyển sinh thành công'
        })
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message || 'Lỗi server'
        })
    }
}

export const getByPage = async (req, res) => {
    try {
        const query = req.query
        const { result, total } = await roundService.getByPage(query)

        return res.status(200).json({
            success: true,
            message: 'Lấy danh sách đợt tuyển sinh thành công',
            data: { result, total }
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || 'Lỗi server'
        })
    }
}
