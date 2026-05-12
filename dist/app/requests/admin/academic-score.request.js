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
const subjectScoreRule = _joi.default.number().min(0).max(10).empty(_joi.default.valid(null, '')).default(0);
const semesterSchema = _joi.default.object({
  name: _joi.default.string().trim().required().label('Tên học kỳ'),
  scores: _joi.default.object({
    math: subjectScoreRule.label('Toán'),
    literature: subjectScoreRule.label('Ngữ Văn'),
    english: subjectScoreRule.label('Tiếng Anh'),
    physics: subjectScoreRule.label('Vật lý'),
    chemistry: subjectScoreRule.label('Hóa học'),
    biology: subjectScoreRule.label('Sinh học'),
    history: subjectScoreRule.label('Lịch sử'),
    geography: subjectScoreRule.label('Địa lý'),
    civic_education: subjectScoreRule.label('GDCD')
  }).required().label('Điểm các môn'),
  average: subjectScoreRule.label('Điểm trung bình học kỳ'),
  conduct: _joi.default.string().trim().default('Tốt').label('Hạnh kiểm'),
  academic_rank: _joi.default.string().trim().default('Giỏi').label('Học lực')
});
const createItem = exports.createItem = _joi.default.object({
  user_id: _joi.default.string().trim().regex(/^[0-9a-fA-F]{24}$/, 'ObjectId').required().label('ID Người dùng').custom((value, helpers) => new _classes.AsyncValidate(value, async function () {
    const academicScore = await _models.AcademicScore.findOne({
      user_id: value
    });
    return !academicScore ? value : helpers.error('any.exists');
  })),
  semesters: _joi.default.array().items(semesterSchema).default([]).label('Danh sách học kỳ')
});
const updateItem = exports.updateItem = _joi.default.object({
  user_id: _joi.default.string().trim().regex(/^[0-9a-fA-F]{24}$/, 'ObjectId').required().label('ID Người dùng').custom((value, helpers) => new _classes.AsyncValidate(value, async function (req) {
    const id = req.academicScoreData?._id || req.params?.id;
    const academicScore = await _models.AcademicScore.findOne({
      user_id: value,
      _id: {
        $ne: id
      }
    });
    return !academicScore ? value : helpers.error('any.exists');
  })),
  semesters: _joi.default.array().items(semesterSchema).default([]).label('Danh sách học kỳ')
});
const getList = exports.getList = _joi.default.object({
  q: (0, _helpers.tryValidateOrDefault)(_joi.default.string().trim(), ''),
  page: (0, _helpers.tryValidateOrDefault)(_joi.default.number().integer().min(1), 1),
  per_page: (0, _helpers.tryValidateOrDefault)(_joi.default.number().integer().min(1).max(100), 50)
});