import AdmissionMethod from '../../models/admission-method'
import { abort } from '@/utils/helpers'

export const createAdmissionMethodService = async (data) => {
    const { code, methodName, description, status } = data

    const checkCode = await AdmissionMethod.findOne({ code })

    if (checkCode) {
        abort(400, 'Mã tuyển sinh đã tồn tại')
    }

    const admissionMethod = await AdmissionMethod.create({
        code,
        methodName,
        description,
        status,
    })

    return admissionMethod
}

export const getAdmissionMethodServiice = async () => {
    const admissionMethod = await AdmissionMethod.find()
    return admissionMethod
}

export const getAdmissionMethodByIdService = async (id) => {
    const admissionMethod = await AdmissionMethod.findById(id)

    if(!admissionMethod){
        abort(400, 'không tồn tại phương thức tuyển sinh')
    }

    return admissionMethod
}

export const updateAdmissionMethod = async(id, data) => {
    const updateAdmission = await AdmissionMethod.findByIdAndUpdate(
        id,
        data,
        { new: true }
    )

    if(!updateAdmission){
        abort(400, 'không tìm thấy phương thức tuyển sinh')
    }

    return updateAdmission
}

export const deleteAdmissionMethod = async(id) => {
    const deleteData = await AdmissionMethod.findOneAndDelete(id)

    if(!deleteData){
        abort(400, 'không tìm thấy phương thức tuyển sinh')
    }
    
    return deleteData
}

export const getAdmissionMethodBySearch = async (data) => {
    const { code, method, description, status} = data
    const query = {}

    if (code) {
        query.code = {
            $regex: code,
            $options: 'i'
        }
    }
    
    if (method) {
        query.methodName = {
            $regex: method,
            $options: 'i'
        }
    }
    
    if (description) {
        query.description = {
            $regex: description,
            $options: 'i'
        }
    }

    if (status) {
        query.status = {
            $regex: status,
            $option: 'i'
        }
    }

    const search = await AdmissionMethod.find(query)

    return search
}

export const getAdmissionMethodByPages = async (data) => {
    const { page = 1, limit = 10 } = data

    const pageNum = Number(page)
    const limitNum = Number(limit)

    const skip = (pageNum - 1) * limitNum

    const admissionMethod = await AdmissionMethod.find()
        .skip(skip)
        .limit(limit)

    const total = await AdmissionMethod.countDocuments()

    const totalPage = Math.ceil(total / limit)

    return {
        admissionMethod,
        total,
        page,
        limit,
        totalPage
    }
}