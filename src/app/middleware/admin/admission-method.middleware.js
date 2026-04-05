import { getAdmissionMethodByIdService } from '@/app/services/admission-method.service'

export const checkAdmissionMethodId = async (req, res, next) => {
    try {
        const { admissionMethodId } = req.params
        const admissionMethod = await getAdmissionMethodByIdService(admissionMethodId)
        req.admissionMethod = admissionMethod
        next()
    } catch (error) {
        res.jsonify(error.status || 500, error.message || 'Lỗi server')
    }
}
