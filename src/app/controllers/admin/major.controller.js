// import { asyncWrap } from "@/utils/helpers";
import * as MajorService from '@/app/services/major.service'
// import { Major } from "@/models";

export const createMajorController = async (req, res) => {
    try {
        const data = req.body
        const major = await MajorService.createMajorService(data)
        return res.json({
            success: true,
            message: 'Tạo ngành học thành công',
            data: major
        })
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Lỗi server',

        })
    }
}

export const getMajorController = async (req, res) => {
    try {
        const major = await MajorService.getMajorService()
        return res.json({
            success: true,
            message: 'Lấy danh sách ngành học thành công',
            data: major
        })
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Lỗi server',

        })
    }
}

export const getMajorByIdController = async (req, res) => {
    try {
        const id = req.params.id

        const majorId = await MajorService.getMajorByIdService(id)

        return res.json({
            success: true,
            message: 'Lấy thông tin ngành học thành công',
            data: majorId
        })
    } catch (err) {
        res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Lỗi server',
            error: err.stack
        })
    }
}

export const updateMajorController = async (req, res) => {
    try {
        const id = req.params.id
        const data = req.body
        const updateData = await MajorService.updateMajorService(id, data)

        const newData = res.status(200).json({
            success: true,
            message: 'Cập nhật ngành học thành công',
            data: updateData
        })

        return newData
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Lỗi server',

        })
    }
}


export const daleteMajorController = async (req, res) => {
    try {
        const id = req.params.id
        const deleData = await MajorService.deleteMajorService(id)

        const newData = res.status(200).json({
            success: true,
            message: 'Xóa ngành học thành công',
            data: deleData
        })

        return newData
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Lỗi server',
            error: err.stack
        })
    }
}

export const getMajorBySearchController = async (req, res) => {
    try {
        const data = req.query
        const majorSearch = await MajorService.getMajorBySearch(data)

        const searchData = res.status(200).json({
            success: true,
            message: 'Lấy danh sách ngành học thành công',
            data: majorSearch
        })

        return searchData
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Lỗi server',

        })
    }
}

export const getMajorByPage = async (req, res) => {
    try {
        const { page, limit } = req.query

        const getPage = await MajorService.getMajorByPages({
            page,
            limit
        })

        const result = res.status(200).json({
            success: true,
            message: '',
            data: {
                result: getPage.major,
                total: getPage.total
            }
        })

        return result
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'Lỗi server'
        })
    }
}