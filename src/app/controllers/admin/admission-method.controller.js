import * as admissionMethodService from '@/app/services/admission-method.service'


export const createAdmissionMethodController = async (req, res) => {
    try {
        const data = req.body
        const getData = await admissionMethodService.createAdmissionMethodService(data)
        const result = res.status(200).json({
            success: true,
            message: 'thêm phương thức tuyển sinh thành công',
            data: getData
        })

        return result
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'lỗi server',
        })
    }
}

export const getAdmissionMethodController = async (req, res) => {
    try {
        const getData = await admissionMethodService.getAdmissionMethodService()
        const result = res.status(200).json({
            success: true,
            message: 'lấy danh sách phương thức tuyển sinh thành công',
            data: getData
        })

        return result
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'lỗi server',
        })
    }
}

export const getAdmissionMethodByIdController = async (req, res) => {
    try {
        const { admissionMethodId } = req.params
        const getData = await admissionMethodService.getAdmissionMethodByIdService(admissionMethodId)
        const result = res.status(200).json({
            success: true,
            message: 'lấy phương thức tuyển sinh thành công',
            data: getData
        })

        return result
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'lỗi server',
        })
    }
}

export const updateAdmissionMethodController = async (req, res) => {
    try {
        const { admissionMethodId } = req.params
        const data = req.body
        const getData = await admissionMethodService.updateAdmissionMethod(admissionMethodId, data)
        const result = res.status(200).json({
            success: true,
            message: 'cập nhật phương thức tuyển sinh thành công',
            data: getData
        })

        return result
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'lỗi server',
        })
    }
}


export const deleteAdmissionMethodController = async (req, res) => {
    try {
        const { admissionMethodId } = req.params
        const getData = await admissionMethodService.deleteAdmissionMethod(admissionMethodId)
        const result = res.status(200).json({
            success: true,
            message: 'xóa phương thức tuyển sinh thành công',
            data: getData
        })

        return result
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'lỗi server',
        })
    }
}

export const getAdmissionMethodBySearchController = async (req, res) => {
    try {
        const data = req.query
        const getData = await admissionMethodService.getAdmissionMethodBySearch(data)
        const result = res.status(200).json({
            success: true,
            message: 'tìm kiếm phương thức tuyển sinh thành công',
            data: getData
        })

        return result
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'lỗi server',
        })
    }
}

export const getAdmissionMethodByPagesController = async (req, res) => {
    try {
        const data = req.query
        const getData = await admissionMethodService.getAdmissionMethodByPages(data)
        const result = res.status(200).json({
            success: true,
            message: 'lấy phương thức tuyển sinh theo trang thành công',
            data: getData
        })

        return result
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'lỗi server',
        })
    }
}