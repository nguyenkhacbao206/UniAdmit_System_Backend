import {abort} from '@/utils/helpers'
import {isValidObjectId} from 'mongoose'
import Preference from '@/models/preference.js'

export async function checkPreferenceId(req, res, next) {
    const {id} = req.params
    if (isValidObjectId(id)) {
        const preference = await Preference.findOne({
            _id: id,
            userId: req.currentUser._id
        })
        if (preference) {
            req.preference = preference
            next()
            return
        }
    }
    abort(404, 'Không tìm thấy nguyện vọng này hoặc bạn không có quyền truy cập.')
}
