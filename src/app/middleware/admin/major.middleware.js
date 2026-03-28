import { Major } from '@/models'
import { abort } from '@/utils/helpers'
import { isValidObjectId } from 'mongoose'

export async function checkMajorId(req, res, next) {
    const defaultId = req.params.id || req.params.majorId
    if (isValidObjectId(defaultId)) {
        const major = await Major.findById(defaultId)
        if (major) {
            req.major = major
            next()
            return
        }
    }
    abort(404, 'Không tìm thấy ngành học.')
}
