import { AcademicScore } from '@/models'
import { abort } from '@/utils/helpers'
import { isValidObjectId } from 'mongoose'

export async function checkAcademicScoreId(req, res, next) {
    const defaultId = req.params.id || req.params.academicScoreId
    if (isValidObjectId(defaultId)) {
        const academicScore = await AcademicScore.findById(defaultId)
        if (academicScore) {
            req.academicScoreData = academicScore
            next()
            return
        }
    }
    abort(404, 'Không tìm thấy điểm học bạ (Academic Score) này.')
}
