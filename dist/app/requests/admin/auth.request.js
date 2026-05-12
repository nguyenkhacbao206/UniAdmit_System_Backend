"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.login = void 0;
var _joi = _interopRequireDefault(require("joi"));
var _configs = require("../../../configs");
const login = exports.login = _joi.default.object({
  phone: _joi.default.string().pattern(_configs.VALIDATE_PHONE_REGEX).required().label('Số điện thoại'),
  password: _joi.default.string().required().label('Mật khẩu')
});