import { Score } from '@/models'
import { abort } from '@/utils/helpers'
import { isValidObjectId } from 'mongoose'

export async function checkScoreId(req, res, next) {
    const defaultId = req.params.id || req.params.scoreId
    if (isValidObjectId(defaultId)) {
        const score = await Score.findById(defaultId)
        if (score) {
            req.scoreData = score
            next()
            return
        }
    }
    abort(404, 'Không tìm thấy điểm thi (Score) này.')
}
