import JoiBase from 'joi'
import { VALIDATE_PHONE_REGEX } from '@/configs'

const Joi = JoiBase

export const createStaff = Joi.object({
    name: Joi.string().required().label('Họ tên'),
    mail: Joi.string().email().required().label('Email'),
    phone: Joi.string().pattern(VALIDATE_PHONE_REGEX).required().label('Số điện thoại'),
    password: Joi.string().min(6).required().label('Mật khẩu'),
    status: Joi.string().valid('active', 'inactive').required().label('Trạng thái')
})

export const updateStaff = Joi.object({
    name: Joi.string().label('Họ tên'),
    mail: Joi.string().email().label('Email'),
    phone: Joi.string().pattern(VALIDATE_PHONE_REGEX).label('Số điện thoại'),
    password: Joi.string().min(6).label('Mật khẩu'),
    status: Joi.string().valid('active', 'inactive').label('Trạng thái')
})
