import Joi from 'joi'

const scoreSchema = Joi.number().min(0).max(10).default(0).label('Điểm số')

export const updateScore = Joi.object({
    math: scoreSchema,
    literature: scoreSchema,
    english: scoreSchema,
    physics: scoreSchema,
    chemistry: scoreSchema,
    biology: scoreSchema,
    history: scoreSchema,
    geography: scoreSchema,
    civic_education: scoreSchema
})

export const verifyScore = Joi.object({
    user_id: Joi.string()
        .required()
        .label('ID người dùng'),

    verified: Joi.boolean()
        .required()
        .label('Trạng thái xác thực')
})
