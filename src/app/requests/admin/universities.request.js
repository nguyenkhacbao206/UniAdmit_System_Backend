import { University } from '@/models'
import { AsyncValidate } from '@/utils/classes'
import { tryValidateOrDefault } from '@/utils/helpers'
import Joi from 'joi'

export const createItem = Joi.object({
    code: Joi.string()
        .trim()
        .max(50)
        .required()
        .label('Mã trường')
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function () {
                    const university = await University.findOne({ code: value })
                    return !university ? value : helpers.error('any.exists')
                })
        ),
    name: Joi.string().trim().max(150).required().label('Tên trường'),
    location: Joi.string().trim().empty(Joi.valid('', null)).default('').label('Địa điểm'),
    majors: Joi.number().integer().min(0).empty(Joi.valid('', null)).default(0).label('Số lượng ngành'),
    status: Joi.string().valid('active', 'inactive').default('active').label('Trạng thái')
})

export const updateItem = Joi.object({
    code: Joi.string()
        .trim()
        .max(50)
        .required()
        .label('Mã trường')
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function (req) {
                    const university = await University.findOne({ code: value, _id: { $ne: req.university._id } })
                    return !university ? value : helpers.error('any.exists')
                })
        ),
    name: Joi.string().trim().max(150).required().label('Tên trường'),
    location: Joi.string().trim().empty(Joi.valid('', null)).default('').label('Địa điểm'),
    majors: Joi.number().integer().min(0).empty(Joi.valid('', null)).default(0).label('Số lượng ngành'),
    status: Joi.string().valid('active', 'inactive').default('active').label('Trạng thái')
})

export const getList = Joi.object({
    q: tryValidateOrDefault(Joi.string().trim(), ''),
    page: tryValidateOrDefault(Joi.number().integer().min(1), 1),
    per_page: tryValidateOrDefault(Joi.number().integer().min(1).max(100), 50),
})
