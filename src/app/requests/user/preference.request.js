import Joi from 'joi'

export const add = Joi.object({
    university: Joi.string()
        .required()
        .label('Mã trường đại học')
        .messages({
            'string.empty': 'Trường đại học không được để trống',
            'any.required': 'Trường đại học là bắt buộc'
        }),
    major: Joi.string()
        .required()
        .label('Mã ngành')
        .messages({
            'string.empty': 'Ngành học không được để trống',
            'any.required': 'Ngành học là bắt buộc'
        }),
    admissionMethod: Joi.string()
        .allow(null, '')
        .label('Phương thức xét tuyển')
})

export const reorder = Joi.object({
    list: Joi.array().items(
        Joi.object({
            id: Joi.string().required().label('Mã nguyện vọng'),
            priority: Joi.number().required().min(1).label('Thứ tự ưu tiên')
        })
    ).min(1).required().label('Danh sách nguyện vọng')
})
