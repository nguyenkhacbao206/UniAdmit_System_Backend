import { AcademicScore } from '@/models'
import { abort } from '@/utils/helpers'
import _ from 'lodash'

export async function getAcademicScores(userId) {
    const data = await AcademicScore.findOne({ user_id: userId })
    if (!data) abort(404, 'Chưa có dữ liệu học bạ.')
    return data
}

export async function updateSemesterScore(userId, semesterName, body) {
    const subjectFields = ['math', 'literature', 'english', 'physics', 'chemistry', 'biology', 'history', 'geography', 'civic_education']
    const scores = _.pick(body, subjectFields)
    
    // Đảm bảo các môn không gửi lên sẽ mặc định là 0
    subjectFields.forEach(f => { if (scores[f] === 'undefined') scores[f] = 0 })

    // Tính điểm trung bình học kỳ
    const values = Object.values(scores)
    const average = values.length > 0 ? _.sum(values) / values.length : 0

    let academicRecord = await AcademicScore.findOne({ user_id: userId })
    
    if (!academicRecord) {
        academicRecord = new AcademicScore({ user_id: userId, semesters: [] })
    }

    // Tìm học kỳ hiện tại trong mảng
    const semesterIndex = academicRecord.semesters.findIndex(s => s.name === semesterName)
    
    const semesterData = {
        name: semesterName,
        scores,
        average: Number(average.toFixed(2)),
        conduct: body.conduct || 'Tốt',
        academic_rank: body.academic_rank || 'Giỏi'
    }

    if (semesterIndex > -1) {
        academicRecord.semesters[semesterIndex] = semesterData
    } else {
        academicRecord.semesters.push(semesterData)
    }

    await academicRecord.save()
    return semesterData
}
