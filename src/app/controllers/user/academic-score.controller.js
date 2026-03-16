import * as academicService from '@/app/services/academic-score.service'

export async function getMyAcademicScores(req, res) {
    const data = await academicService.getAcademicScores(req.currentUser._id)
    res.jsonify(data)
}

export async function updateSemester(req, res) {
    const { semester } = req.params
    const data = await academicService.updateSemesterScore(req.currentUser._id, semester, req.body)
    res.jsonify(data, `Cập nhật điểm ${semester} thành công.`)
}
