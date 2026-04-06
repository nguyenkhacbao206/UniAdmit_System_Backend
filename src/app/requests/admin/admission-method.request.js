import { AdmissionMethod } from '@/models'
import { AsyncValidate } from '@/utils/classes'
// import {tryValidateOrDefault} from '@/utils/helpers'
import Joi from 'joi'

export const createItem = Joi.object({
    code: Joi.string()
        .trim()
        .required()
        .max(50)
        .label('Mã tuyển sinh')
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function () {
                    const admissionMethod = await AdmissionMethod.findOne({ code: value })
                    return !admissionMethod ? value : helpers.error('any.exists')
                })
        ),

    methodName: Joi.string()
        .trim()
        .required()
        .max(100)
        .label('Tên phương thức tuyển sinh'),

    description: Joi.string()
        .trim()
        .required()
        .max(500)
        .label('Mô tả'),

    status: Joi.string()
        .valid('Active', 'Inactive')
        .default('Active')
        .label('Trạng thái')
})

export const updateItem = Joi.object({
    code: Joi.string()
        .trim()
        .max(50)
        .label('Mã tuyển sinh'),

    methodName: Joi.string()
        .trim()
        .max(100)
        .label('Tên phương thức tuyển sinh'),

    description: Joi.string()
        .trim()
        .max(500)
        .label('Mô tả'),

    status: Joi.string()
        .valid('Active', 'Inactive')
        .label('Trạng thái')
})

export const getList = Joi.object({
    code: Joi.string()
        .trim()
        .label('Mã tuyển sinh'),

    method: Joi.string()
        .trim()
        .label('Tên phương thức'),

    description: Joi.string()
        .trim()
        .label('Mô tả'),

    status: Joi.string()
        .valid('Active', 'Inactive')
        .label('Trạng thái')
})
