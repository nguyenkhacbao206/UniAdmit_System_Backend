import Joi from 'joi'

const scoreSchema = Joi.number().min(0).max(10).default(0).label('Điểm số')

export const updateSemesterScore = Joi.object({
    math: scoreSchema,
    literature: scoreSchema,
    english: scoreSchema,
    physics: scoreSchema,
    chemistry: scoreSchema,
    biology: scoreSchema,
    history: scoreSchema,
    geography: scoreSchema,
    civic_education: scoreSchema,
    conduct: Joi.string().allow('').label('Hạnh kiểm'),
    academic_rank: Joi.string().allow('').label('Học lực')
})
