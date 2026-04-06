import { AsyncValidate } from '@/utils/classes'
import { tryValidateOrDefault } from '@/utils/helpers'
import Joi from 'joi'
import { Enrollment } from '@/models'


export const createRequest = Joi.object({
    code: Joi.string()
        .required()
        .trim()
        .max(50)
        .label('Mã ngành')
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function () {
                    const enrollment = await Enrollment.findOne({ code: value })
                    return !enrollment ? value : helpers.error('any.exists')
                })
        ),

    name: Joi.string()
        .required()
        .max(50)
        .label('Tên đợt tuyển sinh'),

    year: Joi.number()
        .required()
        .label('Năm tuyển sinh'),

    status: Joi.string()
        .valid('open', 'close')
        .default('open')
        .label('Trạng thái tuyển sinh'),

    startDate: Joi.date()
        .required()
        .label('Ngày bắt đầu tuyển sinh'),

    endDate: Joi.date()
        .required()
        .label('Ngày kết thúc tuyển sinh'),

})

export const updateRequest = Joi.object({
    code: Joi.string()
        .trim()
        .required()
        .max(50)
        .label('Mã tuyển sinh')
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function (req) {
                    const major = await Enrollment.findOne({ code: value, _id: { $ne: req.major?._id || req.params?.id } })
                    return !major ? value : helpers.error('any.exists')
                })
        ),
    name: Joi.string()
        .trim()
        .required()
        .max(50)
        .label('Tên đợt tuyển sinh'),

    year: Joi.number()
        .required()
        .label('Năm tuyển sinh'),

    status: Joi.string()
        .valid('open', 'close')
        .default('open')
        .label('Trạng thái tuyển sinh'),

    startDate: Joi.date()
        .required()
        .label('Ngày bắt đầu tuyển sinh'),

    endDate: Joi.date()
        .required()
        .label('Ngày kết thúc tuyển sinh'),

})

export const getList = Joi.object({
    q: tryValidateOrDefault(Joi.string().trim(), ''),
    page: tryValidateOrDefault(Joi.number().integer().min(1), 1),
    per_page: tryValidateOrDefault(Joi.number().integer().min(1).max(100), 50),
    code: tryValidateOrDefault(Joi.string().trim(), ''),
    name: tryValidateOrDefault(Joi.string().trim(), '')
})
