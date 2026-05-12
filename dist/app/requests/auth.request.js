"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loginUniversal = void 0;
var _joi = _interopRequireDefault(require("joi"));
const loginUniversal = exports.loginUniversal = _joi.default.object({
  identifier: _joi.default.string().label('Email hoặc số điện thoại'),
  username: _joi.default.string().label('Tên đăng nhập'),
  password: _joi.default.string().required().messages({
    'any.required': 'Vui lòng nhập mật khẩu',
    'string.empty': 'Vui lòng nhập mật khẩu'
  })
}).xor('identifier', 'username').messages({
  'object.missingVariant': 'Vui lòng điền email hoặc số điện thoại',
  'object.xor': 'Vui lòng điền email hoặc số điện thoại'
});