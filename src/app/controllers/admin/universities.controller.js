import * as universitiesService from '@/app/services/universities.service'
// import { message } from 'statuses'

export const createUniversitiesController = async (req, res) => {
    try {
        const data = req.body
        const createUniversity = await universitiesService.createUniversity(data)

        return res.status(200).json({
            success: true,
            message: 'Tạo trường thành công',
            data: createUniversity
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'Lỗi server'
        })
    }
}

export const getUniversitiesController = async (req, res) => {
    try {
        const getUniversity = await universitiesService.getUniversity()
        return res.status(200).json({
            success: true,
            message: 'Lấy danh sách trường thành công',
            data: getUniversity
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'Lỗi server'
        })
    }
}

export const getUniversityByIdController = async (req, res) => {
    try {
        const id = req.params.id
        const getUniversityById = await universitiesService.getUniversityById(id)

        return res.status.json({
            success: true,
            message: 'Lấy thông tin trường thành công',
            data: getUniversityById
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || 'Lỗi server'
        })
    }
}

export const updateUniversitiesController = async (req, res) => {
    try {
        const id = req.params.id
        const data = req.body
        const updateUniversity = await universitiesService.updateUniversity(id, data)

        return res.status.json({
            success: true,
            message: 'cập nhật trường thành công',
            data: updateUniversity
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || 'Lỗi server'
        })
    }
}

export const deleteUniversitiesController = async (req, res) => {
    try {
        const id = req.params.id
        const deleteUniversity = await universitiesService.deleteUniversity(id)

        return res.status.json({
            success: true,
            message: 'Xóa trường thành công',
            data: deleteUniversity
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || 'Lỗi server'
        })
    }
}


export const getUniversityBySearch = async (req, res) => {
    try {
        const data = req.query
        const getUniversityBySearch = await universitiesService.getUniversityBySearch(data)

        return res.status.json({
            success: true,
            message: 'search thành công',
            data: getUniversityBySearch
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || 'Lỗi server'
        })
    }
}


export const getUniversityByPage = async (req, res) => {
    try {
        const { page, limit } = req.query

        const getPage = await universitiesService.getUniversityByPages(
            page,
            limit
        )

        const result = res.status(200).json({
            success: true,
            message: '',
            data: getPage
        })

        return result
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'Lỗi server'
        })
    }
}