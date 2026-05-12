"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyOTP = exports.verifyForgotPasswordOTP = exports.resetPassword = exports.resendOtp = exports.register = exports.login = exports.forgotPassword = void 0;
var _joi = _interopRequireDefault(require("joi"));
var _configs = require("../../../configs");
const login = exports.login = _joi.default.object({
  email: _joi.default.string().pattern(_configs.VALIDATE_EMAIL_REGEX).required().label('Email'),
  password: _joi.default.string().required().label('Mật khẩu')
});
const register = exports.register = _joi.default.object({
  name: _joi.default.string().required().label('Họ và tên'),
  email: _joi.default.string().pattern(_configs.VALIDATE_EMAIL_REGEX).required().label('Email'),
  phone: _joi.default.string().pattern(_configs.VALIDATE_PHONE_REGEX).required().label('Số điện thoại'),
  password: _joi.default.string().min(6).required().label('Mật khẩu'),
  password_confirmation: _joi.default.any().equal(_joi.default.ref('password')).required().label('Xác nhận mật khẩu').messages({
    'any.only': '{{#label}} không khớp'
  })
});
const verifyOTP = exports.verifyOTP = _joi.default.object({
  email: _joi.default.string().pattern(_configs.VALIDATE_EMAIL_REGEX).required().label('Email'),
  otp: _joi.default.string().length(6).required().label('Mã xác thực')
});
const resendOtp = exports.resendOtp = _joi.default.object({
  email: _joi.default.string().pattern(_configs.VALIDATE_EMAIL_REGEX).required().label('Email')
});
const forgotPassword = exports.forgotPassword = _joi.default.object({
  email: _joi.default.string().pattern(_configs.VALIDATE_EMAIL_REGEX).required().label('Email')
});
const verifyForgotPasswordOTP = exports.verifyForgotPasswordOTP = _joi.default.object({
  email: _joi.default.string().pattern(_configs.VALIDATE_EMAIL_REGEX).required().label('Email'),
  otp: _joi.default.string().length(6).required().label('Mã xác thực')
});
const resetPassword = exports.resetPassword = _joi.default.object({
  email: _joi.default.string().pattern(_configs.VALIDATE_EMAIL_REGEX).required().label('Email'),
  password: _joi.default.string().min(6).required().label('Mật khẩu'),
  password_confirmation: _joi.default.any().equal(_joi.default.ref('password')).required().label('Xác nhận mật khẩu').messages({
    'any.only': '{{#label}} không khớp'
  })
});