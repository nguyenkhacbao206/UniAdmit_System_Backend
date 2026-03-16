import Joi from 'joi'
import {VALIDATE_PHONE_REGEX, VALIDATE_EMAIL_REGEX} from '@/configs'

export const login = Joi.object({
    email: Joi.string()
        .pattern(VALIDATE_EMAIL_REGEX)
        .required()
        .label('Email'),
    password: Joi.string().required().label('Mật khẩu'),
})

export const register = Joi.object({
    name: Joi.string().required().label('Họ và tên'),
    email: Joi.string()
        .pattern(VALIDATE_EMAIL_REGEX)
        .required()
        .label('Email'),
    phone: Joi.string()
        .pattern(VALIDATE_PHONE_REGEX)
        .required()
        .label('Số điện thoại'),
    password: Joi.string()
        .min(6)
        .required()
        .label('Mật khẩu'),
    password_confirmation: Joi.any()
        .equal(Joi.ref('password'))
        .required()
        .label('Xác nhận mật khẩu')
        .messages({'any.only': '{{#label}} không khớp'}),
})

export const verifyOTP = Joi.object({
    email: Joi.string()
        .pattern(VALIDATE_EMAIL_REGEX)
        .required()
        .label('Email'),
    otp: Joi.string().length(6).required().label('Mã xác thực'),
})

export const resendOtp = Joi.object({
    email: Joi.string()
        .pattern(VALIDATE_EMAIL_REGEX)
        .required()
        .label('Email'),
})

export const forgotPassword = Joi.object({
    email: Joi.string()
        .pattern(VALIDATE_EMAIL_REGEX)
        .required()
        .label('Email'),
})

export const verifyForgotPasswordOTP = Joi.object({
    email: Joi.string()
        .pattern(VALIDATE_EMAIL_REGEX)
        .required()
        .label('Email'),
    otp: Joi.string().length(6).required().label('Mã xác thực'),
})

export const resetPassword = Joi.object({
    email: Joi.string()
        .pattern(VALIDATE_EMAIL_REGEX)
        .required()
        .label('Email'),
    password: Joi.string()
        .min(6)
        .required()
        .label('Mật khẩu'),
    password_confirmation: Joi.any()
        .equal(Joi.ref('password'))
        .required()
        .label('Xác nhận mật khẩu')
        .messages({ 'any.only': '{{#label}} không khớp' }),
})

