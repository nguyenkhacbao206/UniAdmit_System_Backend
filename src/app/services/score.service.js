import { Score } from '@/models'
import { abort } from '@/utils/helpers'
import _ from 'lodash'

// Định nghĩa các tổ hợp môn
const COMBINATIONS_CONFIG = {
    'A00': ['math', 'physics', 'chemistry'],
    'A01': ['math', 'physics', 'english'],
    'B00': ['math', 'chemistry', 'biology'],
    'C00': ['literature', 'history', 'geography'],
    'D01': ['math', 'literature', 'english'],
    'D07': ['math', 'chemistry', 'english'],
    'C01': ['literature', 'math', 'physics'],
    'C02': ['literature', 'math', 'chemistry'],
    'C03': ['literature', 'math', 'history'],
    'D09': ['math', 'history', 'english'],
    'D10': ['math', 'geography', 'english'],
}

/**
 * Tính toán điểm các tổ hợp dựa trên điểm các môn
 */
function calculateCombinations(scores) {
    const results = {}
    for (const [block, subjects] of Object.entries(COMBINATIONS_CONFIG)) {
        const total = subjects.reduce((sum, sub) => sum + (scores[sub] || 0), 0)
        results[block] = Number(total.toFixed(2))
    }
    return results
}

export async function getScoreByUserId(userId) {
    const score = await Score.findOne({ user_id: userId })
    if (!score) {
        abort(404, 'Chưa có dữ liệu điểm thi.')
    }
        
    return score
}

export async function updateOrCreateScore(userId, scoreData) {
    // Chỉ lấy các trường điểm hợp lệ
    const subjectFields = ['math', 'literature', 'english', 'physics', 'chemistry', 'biology', 'history', 'geography', 'civic_education']
    const scores = _.pick(scoreData, subjectFields)

    // Đảm bảo các trường không có dữ liệu sẽ về 0
    subjectFields.forEach(field => {
        if (!scores[field]) scores[field] = 0
    })

    // Tính điểm trung bình (cộng tất cả các môn đã có điểm chia đều)
    const values = Object.values(scores)
    const average = values.length > 0 ? _.sum(values) / values.length : 0

    // Tính tổ hợp
    const combinations = calculateCombinations(scores)

    const updatedScore = await Score.findOneAndUpdate(
        { user_id: userId },
        {
            ...scores,
            combinations,
            average: Number(average.toFixed(2)),
            verified: false // Reset trạng thái xác thực khi cập nhật điểm
        },
        { new: true, upsert: true }
    )

    return updatedScore
}

export async function verifyScore(userId, status) {
    const score = await Score.findOneAndUpdate(
        { user_id: userId },
        { verified: status },
        { new: true }
    )
    if (!score) abort(404, 'Không tìm thấy bảng điểm để xác thực.')
    return score
}
