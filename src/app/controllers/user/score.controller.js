import * as scoreService from '@/app/services/score.service'

export async function getMyScore(req, res) {
    const data = await scoreService.getScoreByUserId(req.currentUser._id)
    res.jsonify(data)
}

export async function updateMyScore(req, res) {
    const data = await scoreService.updateOrCreateScore(req.currentUser._id, req.body)
    res.jsonify(data, 'Cập nhật điểm thi thành công. Đang chờ xác thực.')
}

export async function adminVerifyScore(req, res) {
    const { user_id, verified } = req.body
    const data = await scoreService.verifyScore(user_id, verified)
    res.jsonify(data, verified ? 'Đã xác thực bảng điểm' : 'Đã hủy xác thực bảng điểm')
}
