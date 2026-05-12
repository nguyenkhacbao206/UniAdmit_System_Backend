import { Enrollment } from '@/models'
import { abort } from '@/utils/helpers'
import { isValidObjectId } from 'mongoose'

export const checkEnrollmentId = async (req, res, next) => {
    const defaultId = req.params.id

    if (isValidObjectId(defaultId)) {
        const enrollment = await Enrollment.findById(defaultId)
        if (enrollment) {
            req.enrollment = enrollment
            next()
            return
        }
    }
    abort(404, 'không tìm thấy đợi tuyển sinh')
}