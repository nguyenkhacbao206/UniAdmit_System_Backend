import { AcademicScore } from '@/models'
import { AsyncValidate } from '@/utils/classes'
import { tryValidateOrDefault } from '@/utils/helpers'
import Joi from 'joi'

const subjectScoreRule = Joi.number().min(0).max(10).empty(Joi.valid(null, '')).default(0)

const semesterSchema = Joi.object({
    name: Joi.string().trim().required().label('Tên học kỳ'),
    scores: Joi.object({
        math: subjectScoreRule.label('Toán'),
        literature: subjectScoreRule.label('Ngữ Văn'),
        english: subjectScoreRule.label('Tiếng Anh'),
        physics: subjectScoreRule.label('Vật lý'),
        chemistry: subjectScoreRule.label('Hóa học'),
        biology: subjectScoreRule.label('Sinh học'),
        history: subjectScoreRule.label('Lịch sử'),
        geography: subjectScoreRule.label('Địa lý'),
        civic_education: subjectScoreRule.label('GDCD')
    }).required().label('Điểm các môn'),
    average: subjectScoreRule.label('Điểm trung bình học kỳ'),
    conduct: Joi.string().trim().default('Tốt').label('Hạnh kiểm'),
    academic_rank: Joi.string().trim().default('Giỏi').label('Học lực')
})

export const createItem = Joi.object({
    user_id: Joi.string()
        .trim()
        .regex(/^[0-9a-fA-F]{24}$/, 'ObjectId')
        .required()
        .label('ID Người dùng')
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function () {
                    const academicScore = await AcademicScore.findOne({ user_id: value })
                    return !academicScore ? value : helpers.error('any.exists')
                })
        ),
    semesters: Joi.array().items(semesterSchema).default([]).label('Danh sách học kỳ')
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
                    const id = req.academicScoreData?._id || req.params?.id
                    const academicScore = await AcademicScore.findOne({ user_id: value, _id: { $ne: id } })
                    return !academicScore ? value : helpers.error('any.exists')
                })
        ),
    semesters: Joi.array().items(semesterSchema).default([]).label('Danh sách học kỳ')
})

export const getList = Joi.object({
    q: tryValidateOrDefault(Joi.string().trim(), ''),
    page: tryValidateOrDefault(Joi.number().integer().min(1), 1),
    per_page: tryValidateOrDefault(Joi.number().integer().min(1).max(100), 50),
})
