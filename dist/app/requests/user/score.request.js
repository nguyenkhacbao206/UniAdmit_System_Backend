"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyScore = exports.updateScore = void 0;
var _joi = _interopRequireDefault(require("joi"));
const scoreSchema = _joi.default.number().min(0).max(10).default(0).label('Điểm số');
const updateScore = exports.updateScore = _joi.default.object({
  math: scoreSchema,
  literature: scoreSchema,
  english: scoreSchema,
  physics: scoreSchema,
  chemistry: scoreSchema,
  biology: scoreSchema,
  history: scoreSchema,
  geography: scoreSchema,
  civic_education: scoreSchema
});
const verifyScore = exports.verifyScore = _joi.default.object({
  user_id: _joi.default.string().required().label('ID người dùng'),
  verified: _joi.default.boolean().required().label('Trạng thái xác thực')
});