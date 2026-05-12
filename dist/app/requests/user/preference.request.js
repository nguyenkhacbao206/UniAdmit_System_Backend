"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reorder = exports.add = void 0;
var _joi = _interopRequireDefault(require("joi"));
const add = exports.add = _joi.default.object({
  university: _joi.default.string().required().label('Mã trường đại học').messages({
    'string.empty': 'Trường đại học không được để trống',
    'any.required': 'Trường đại học là bắt buộc'
  }),
  major: _joi.default.string().required().label('Mã ngành').messages({
    'string.empty': 'Ngành học không được để trống',
    'any.required': 'Ngành học là bắt buộc'
  }),
  admissionMethod: _joi.default.string().allow(null, '').label('Phương thức xét tuyển')
});
const reorder = exports.reorder = _joi.default.object({
  list: _joi.default.array().items(_joi.default.object({
    id: _joi.default.string().required().label('Mã nguyện vọng'),
    priority: _joi.default.number().required().min(1).label('Thứ tự ưu tiên')
  })).min(1).required().label('Danh sách nguyện vọng')
});