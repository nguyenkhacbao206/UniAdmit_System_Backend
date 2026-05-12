import JoiBase from 'joi'
import joiObjectId from 'joi-objectid'
import { VALIDATE_PHONE_REGEX } from '@/configs'

const Joi = JoiBase
Joi.objectId = joiObjectId(Joi)

export const createStaff = Joi.object({
    name: Joi.string().required().label('Họ tên'),
    mail: Joi.string().email().required().label('Email'),
    phone: Joi.string().pattern(VALIDATE_PHONE_REGEX).required().label('Số điện thoại'),
    password: Joi.string().min(6).required().label('Mật khẩu'),
    gender: Joi.string().allow('', null).label('Giới tính'),
    dob: Joi.date().allow(null).label('Ngày sinh'),
    address: Joi.string().allow('', null).label('Địa chỉ'),
})

export const updateStaff = Joi.object({
    name: Joi.string().label('Họ tên'),
    mail: Joi.string().email().label('Email'),
    phone: Joi.string().pattern(VALIDATE_PHONE_REGEX).label('Số điện thoại'),
    password: Joi.string().min(6).allow('', null).label('Mật khẩu'),
    gender: Joi.string().allow('', null).label('Giới tính'),
    dob: Joi.date().allow(null).label('Ngày sinh'),
    address: Joi.string().allow('', null).label('Địa chỉ'),
    status: Joi.string().label('Trạng thái'),
})