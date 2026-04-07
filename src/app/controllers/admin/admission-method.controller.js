import {
    createAdmissionMethodService,
    getAdmissionMethodServiice,
    getAdmissionMethodByIdService,
    updateAdmissionMethod,
    deleteAdmissionMethod,
    getAdmissionMethodBySearch
} from '@/app/services/admission-method.service'

export const readRoot = async (req, res) => {
    const result = await getAdmissionMethodServiice()
    res.jsonify(200, 'Lấy danh sách phương thức tuyển sinh thành công', result)
}

export const getDetail = async (req, res) => {
    const { admissionMethodId } = req.params
    const result = await getAdmissionMethodByIdService(admissionMethodId)
    res.jsonify(200, 'Lấy phương thức tuyển sinh thành công', result)
}

export const createItem = async (req, res) => {
    const data = req.body
    const result = await createAdmissionMethodService(data)
    res.jsonify(201, 'Tạo phương thức tuyển sinh thành công', result)
}

export const updateItem = async (req, res) => {
    const { admissionMethodId } = req.params
    const data = req.body
    const result = await updateAdmissionMethod(admissionMethodId, data)
    res.jsonify(200, 'Cập nhật phương thức tuyển sinh thành công', result)
}

export const deleteItem = async (req, res) => {
    const { admissionMethodId } = req.params
    const result = await deleteAdmissionMethod(admissionMethodId)
    res.jsonify(200, 'Xóa phương thức tuyển sinh thành công', result)
}

export const search = async (req, res) => {
    const query = req.query
    const result = await getAdmissionMethodBySearch(query)
    res.jsonify(200, 'Tìm kiếm phương thức tuyển sinh thành công', result)
}
