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
    
    let academicRecord = await AcademicScore.findOne({ user_id: userId })
    if (!academicRecord) {
        academicRecord = new AcademicScore({ user_id: userId, semesters: [] })
    }

    // Tìm học kỳ hiện tại trong mảng
    const semesterIndex = academicRecord.semesters.findIndex(s => s.name === semesterName)
    const currentSemester = semesterIndex > -1 ? academicRecord.semesters[semesterIndex] : { scores: {} }

    const scores = { ...currentSemester.scores }
    
    // Cập nhật các môn gửi lên
    subjectFields.forEach(f => {
        if (body[f] !== 'undefined') {
            scores[f] = Number(body[f])
        } else if (scores[f] === 'undefined') {
            scores[f] = 0
        }
    })

    // Tính điểm trung bình học kỳ
    const values = subjectFields.map(f => scores[f] || 0)
    const average = values.length > 0 ? _.sum(values) / values.length : 0
    const roundedAverage = Number(average.toFixed(2))

    // Tính học lực 
    const minScore = _.min(values)
    const maxMainScore = _.max(['math', 'literature', 'english'].map(s => scores[s] || 0))
    
    let academicRank = 'Kém'
    if (roundedAverage >= 8.0 && minScore >= 6.5 && maxMainScore >= 8.0) {
        academicRank = 'Giỏi'
    } else if (roundedAverage >= 6.5 && minScore >= 5.0 && maxMainScore >= 6.5) {
        academicRank = 'Khá'
    } else if (roundedAverage >= 5.0 && minScore >= 3.5 && maxMainScore >= 5.0) {
        academicRank = 'Trung bình'
    } else if (roundedAverage >= 3.5 && minScore >= 2.0) {
        academicRank = 'Yếu'
    }

    const semesterData = {
        name: semesterName,
        scores,
        average: roundedAverage,
        conduct: body.conduct || currentSemester.conduct || 'Tốt',
        academic_rank: academicRank
    }

    if (semesterIndex > -1) {
        academicRecord.semesters[semesterIndex] = semesterData
    } else {
        academicRecord.semesters.push(semesterData)
    }

    await academicRecord.save()
    return semesterData
}
