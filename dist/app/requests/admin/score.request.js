"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateItem = exports.getList = exports.createItem = void 0;
var _models = require("../../../models");
var _classes = require("../../../utils/classes");
var _helpers = require("../../../utils/helpers");
var _joi = _interopRequireDefault(require("joi"));
const scoreValidation = _joi.default.number().min(0).max(10).empty(_joi.default.valid(null, '')).default(0);
const createItem = exports.createItem = _joi.default.object({
  user_id: _joi.default.string().trim().regex(/^[0-9a-fA-F]{24}$/, 'ObjectId').required().label('ID Người dùng').custom((value, helpers) => new _classes.AsyncValidate(value, async function () {
    const score = await _models.Score.findOne({
      user_id: value
    });
    return !score ? value : helpers.error('any.exists');
  })),
  math: scoreValidation.label('Toán'),
  literature: scoreValidation.label('Vữ Văn'),
  english: scoreValidation.label('Tiếng Anh'),
  physics: scoreValidation.label('Vật lý'),
  chemistry: scoreValidation.label('Hóa học'),
  biology: scoreValidation.label('Sinh học'),
  history: scoreValidation.label('Lịch sử'),
  geography: scoreValidation.label('Địa lý'),
  civic_education: scoreValidation.label('GDCD'),
  combinations: _joi.default.object().optional().label('Tổ hợp môn'),
  average: scoreValidation.label('Điểm trung bình'),
  verified: _joi.default.boolean().default(false).label('Xác thực')
});
const updateItem = exports.updateItem = _joi.default.object({
  user_id: _joi.default.string().trim().regex(/^[0-9a-fA-F]{24}$/, 'ObjectId').required().label('ID Người dùng').custom((value, helpers) => new _classes.AsyncValidate(value, async function (req) {
    const id = req.scoreData?._id || req.params?.id;
    const score = await _models.Score.findOne({
      user_id: value,
      _id: {
        $ne: id
      }
    });
    return !score ? value : helpers.error('any.exists');
  })),
  math: scoreValidation.label('Toán'),
  literature: scoreValidation.label('Vữ Văn'),
  english: scoreValidation.label('Tiếng Anh'),
  physics: scoreValidation.label('Vật lý'),
  chemistry: scoreValidation.label('Hóa học'),
  biology: scoreValidation.label('Sinh học'),
  history: scoreValidation.label('Lịch sử'),
  geography: scoreValidation.label('Địa lý'),
  civic_education: scoreValidation.label('GDCD'),
  combinations: _joi.default.object().optional().label('Tổ hợp môn'),
  average: scoreValidation.label('Điểm trung bình'),
  verified: _joi.default.boolean().default(false).label('Xác thực')
});
const getList = exports.getList = _joi.default.object({
  q: (0, _helpers.tryValidateOrDefault)(_joi.default.string().trim(), ''),
  page: (0, _helpers.tryValidateOrDefault)(_joi.default.number().integer().min(1), 1),
  per_page: (0, _helpers.tryValidateOrDefault)(_joi.default.number().integer().min(1).max(100), 50)
});