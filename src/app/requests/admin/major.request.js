import { Major } from '@/models'
import { AsyncValidate } from '@/utils/classes'
import { tryValidateOrDefault } from '@/utils/helpers'
import Joi from 'joi'

export const createItem = Joi.object({
    code: Joi.string()
        .trim()
        .max(50)
        .required()
        .label('Mã ngành')
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function () {
                    const major = await Major.findOne({ code: value })
                    return !major ? value : helpers.error('any.exists')
                })
        ),
    name: Joi.string().trim().max(150).required().label('Tên ngành'),
    major: Joi.string().trim().max(150).required().label('Chuyên ngành'),
    category: Joi.string().trim().max(100).required().label('Phương thức xét tuyển/Danh mục'),
    university_id: Joi.string()
        .trim()
        .regex(/^[0-9a-fA-F]{24}$/, 'ObjectId')
        .required()
        .label('ID trường đại học'),
    quota: Joi.number().integer().min(0).required().label('Chỉ tiêu'),
    description: Joi.string().trim().empty(Joi.valid('', null)).default('').label('Mô tả'),
    duration: Joi.string()
        .valid('4 năm', '5 năm', '6 năm', '7 năm', '8 năm')
        .default('4 năm')
        .label('Thời gian đào tạo'),
    status: Joi.string().valid('active', 'inactive').default('active').label('Trạng thái'),
    groups: Joi.array().items(Joi.string().trim()).default([]).label('Khối xét tuyển'),
    careers: Joi.array().items(Joi.string().trim()).default([]).label('Cơ hội nghề nghiệp'),
    curriculum: Joi.array().items(Joi.string().trim()).default([]).label('Chương trình đào tạo'),
    benchmarks: Joi.array().items(Joi.object({
        year: Joi.number().integer().required(),
        value: Joi.number().required(),
        quota: Joi.number().integer().optional()
    })).default([]).label('Điểm chuẩn'),
    employment_rate: Joi.string().trim().default('0%').label('Tỷ lệ có việc làm')
})

export const updateItem = Joi.object({
    code: Joi.string()
        .trim()
        .max(50)
        .required()
        .label('Mã ngành')
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function (req) {
                    const major = await Major.findOne({ code: value, _id: { $ne: req.major?._id || req.params?.id } })
                    return !major ? value : helpers.error('any.exists')
                })
        ),
    name: Joi.string().trim().max(150).required().label('Tên ngành'),
    major: Joi.string().trim().max(150).required().label('Chuyên ngành'),
    category: Joi.string().trim().max(100).required().label('Phương thức xét tuyển/Danh mục'),
    university_id: Joi.string()
        .trim()
        .regex(/^[0-9a-fA-F]{24}$/, 'ObjectId')
        .required()
        .label('ID trường đại học'),
    quota: Joi.number().integer().min(0).required().label('Chỉ tiêu'),
    description: Joi.string().trim().empty(Joi.valid('', null)).default('').label('Mô tả'),
    duration: Joi.string()
        .valid('4 năm', '5 năm', '6 năm', '7 năm', '8 năm')
        .default('4 năm')
        .label('Thời gian đào tạo'),
    status: Joi.string().valid('active', 'inactive').default('active').label('Trạng thái'),
    groups: Joi.array().items(Joi.string().trim()).default([]).label('Khối xét tuyển'),
    careers: Joi.array().items(Joi.string().trim()).default([]).label('Cơ hội nghề nghiệp'),
    curriculum: Joi.array().items(Joi.string().trim()).default([]).label('Chương trình đào tạo'),
    benchmarks: Joi.array().items(Joi.object({
        year: Joi.number().integer().required(),
        value: Joi.number().required(),
        quota: Joi.number().integer().optional()
    })).default([]).label('Điểm chuẩn'),
    employment_rate: Joi.string().trim().default('0%').label('Tỷ lệ có việc làm')
})

export const getList = Joi.object({
    q: tryValidateOrDefault(Joi.string().trim(), ''),
    page: tryValidateOrDefault(Joi.number().integer().min(1), 1),
    per_page: tryValidateOrDefault(Joi.number().integer().min(1).max(100), 50),
    code: tryValidateOrDefault(Joi.string().trim(), ''),
    name: tryValidateOrDefault(Joi.string().trim(), ''),
    university_id: tryValidateOrDefault(Joi.string().trim(), ''),
    category: tryValidateOrDefault(Joi.string().trim(), ''),
    keyword: tryValidateOrDefault(Joi.string().trim(), '')
})
