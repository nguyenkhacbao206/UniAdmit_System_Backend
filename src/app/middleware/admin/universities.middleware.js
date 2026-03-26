import { University } from '@/models'
import { abort } from '@/utils/helpers'
import { isValidObjectId } from 'mongoose'

export async function checkUniversityId(req, res, next) {
    if (isValidObjectId(req.params.universityId)) {
        const university = await University.findById(req.params.universityId)
        if (university) {
            req.university = university
            next()
            return
        }
    }
    abort(404, 'Không tìm thấy trường đại học.')
}
