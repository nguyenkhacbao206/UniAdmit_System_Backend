import JoiBase from 'joi'
import joiObjectId from 'joi-objectid'
import { VALIDATE_PHONE_REGEX } from '@/configs'

const Joi = JoiBase
Joi.objectId = joiObjectId(Joi)

export const createStaff = Joi.object({
    name: Joi.string().required().label('Họ tên'),
    email: Joi.string().email().required().label('Email'),
    phone: Joi.string().pattern(VALIDATE_PHONE_REGEX).required().label('Số điện thoại'),
    password: Joi.string().min(6).required().label('Mật khẩu'),
    role_ids: Joi.array().items(Joi.objectId()).required().label('Vai trò'),
})

export const updateStaff = Joi.object({
    name: Joi.string().label('Họ tên'),
    email: Joi.string().email().label('Email'),
    phone: Joi.string().pattern(VALIDATE_PHONE_REGEX).label('Số điện thoại'),
    password: Joi.string().min(6).label('Mật khẩu'),
    role_ids: Joi.array().items(Joi.objectId()).label('Vai trò'),
    status: Joi.string().label('Trạng thái'),
})