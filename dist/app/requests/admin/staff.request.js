"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateStaff = exports.createStaff = void 0;
var _joi = _interopRequireDefault(require("joi"));
var _joiObjectid = _interopRequireDefault(require("joi-objectid"));
var _configs = require("../../../configs");
const Joi = _joi.default;
Joi.objectId = (0, _joiObjectid.default)(Joi);
const createStaff = exports.createStaff = Joi.object({
  name: Joi.string().required().label('Họ tên'),
  mail: Joi.string().email().required().label('Email'),
  phone: Joi.string().pattern(_configs.VALIDATE_PHONE_REGEX).required().label('Số điện thoại'),
  password: Joi.string().min(6).required().label('Mật khẩu'),
  gender: Joi.string().allow('', null).label('Giới tính'),
  dob: Joi.date().allow(null).label('Ngày sinh'),
  address: Joi.string().allow('', null).label('Địa chỉ')
});
const updateStaff = exports.updateStaff = Joi.object({
  name: Joi.string().label('Họ tên'),
  mail: Joi.string().email().label('Email'),
  phone: Joi.string().pattern(_configs.VALIDATE_PHONE_REGEX).label('Số điện thoại'),
  password: Joi.string().min(6).allow('', null).label('Mật khẩu'),
  gender: Joi.string().allow('', null).label('Giới tính'),
  dob: Joi.date().allow(null).label('Ngày sinh'),
  address: Joi.string().allow('', null).label('Địa chỉ'),
  status: Joi.string().label('Trạng thái')
});