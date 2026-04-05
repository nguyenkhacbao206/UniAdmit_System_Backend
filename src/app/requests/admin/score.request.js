import { Score } from '@/models'
import { AsyncValidate } from '@/utils/classes'
import { tryValidateOrDefault } from '@/utils/helpers'
import Joi from 'joi'

const scoreValidation = Joi.number().min(0).max(10).empty(Joi.valid(null, '')).default(0)

export const createItem = Joi.object({
    user_id: Joi.string()
        .trim()
        .regex(/^[0-9a-fA-F]{24}$/, 'ObjectId')
        .required()
        .label('ID Người dùng')
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function () {
                    const score = await Score.findOne({ user_id: value })
                    return !score ? value : helpers.error('any.exists')
                })
        ),
    math: scoreValidation.label('Toán'),
    literature: scoreValidation.label('Vữ Văn'),
    english: scoreValidation.label('Tiếng Anh'),
    physics: scoreValidation.label('Vật lý'),
    chemistry: scoreValidation.label('Hóa học'),
    biology: scoreValidation.label('Sinh học'),
    history: scoreValidation.label('Lịch sử'),
    geography: scoreValidation.label('Địa lý'),
    civic_education: scoreValidation.label('GDCD'),
    combinations: Joi.object().optional().label('Tổ hợp môn'),
    average: scoreValidation.label('Điểm trung bình'),
    verified: Joi.boolean().default(false).label('Xác thực')
})

export const updateItem = Joi.object({
    user_id: Joi.string()
        .trim()
        .regex(/^[0-9a-fA-F]{24}$/, 'ObjectId')
        .required()
        .label('ID Người dùng')
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function (req) {
                    const id = req.scoreData?._id || req.params?.id
                    const score = await Score.findOne({ user_id: value, _id: { $ne: id } })
                    return !score ? value : helpers.error('any.exists')
                })
        ),
    math: scoreValidation.label('Toán'),
    literature: scoreValidation.label('Vữ Văn'),
    english: scoreValidation.label('Tiếng Anh'),
    physics: scoreValidation.label('Vật lý'),
    chemistry: scoreValidation.label('Hóa học'),
    biology: scoreValidation.label('Sinh học'),
    history: scoreValidation.label('Lịch sử'),
    geography: scoreValidation.label('Địa lý'),
    civic_education: scoreValidation.label('GDCD'),
    combinations: Joi.object().optional().label('Tổ hợp môn'),
    average: scoreValidation.label('Điểm trung bình'),
    verified: Joi.boolean().default(false).label('Xác thực')
})

export const getList = Joi.object({
    q: tryValidateOrDefault(Joi.string().trim(), ''),
    page: tryValidateOrDefault(Joi.number().integer().min(1), 1),
    per_page: tryValidateOrDefault(Joi.number().integer().min(1).max(100), 50),
})
