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
const createItem = exports.createItem = _joi.default.object({
  code: _joi.default.string().trim().max(50).required().label('Mã ngành').custom((value, helpers) => new _classes.AsyncValidate(value, async function () {
    const major = await _models.Major.findOne({
      code: value
    });
    return !major ? value : helpers.error('any.exists');
  })),
  name: _joi.default.string().trim().max(150).required().label('Tên ngành'),
  major: _joi.default.string().trim().max(150).required().label('Chuyên ngành'),
  category: _joi.default.string().trim().max(100).required().label('Phương thức xét tuyển/Danh mục'),
  university_id: _joi.default.string().trim().regex(/^[0-9a-fA-F]{24}$/, 'ObjectId').required().label('ID trường đại học'),
  quota: _joi.default.number().integer().min(0).required().label('Chỉ tiêu'),
  description: _joi.default.string().trim().empty(_joi.default.valid('', null)).default('').label('Mô tả'),
  duration: _joi.default.string().valid('4 năm', '5 năm', '6 năm', '7 năm', '8 năm').default('4 năm').label('Thời gian đào tạo'),
  status: _joi.default.string().valid('active', 'inactive').default('active').label('Trạng thái'),
  groups: _joi.default.array().items(_joi.default.string().trim()).default([]).label('Khối xét tuyển'),
  careers: _joi.default.array().items(_joi.default.string().trim()).default([]).label('Cơ hội nghề nghiệp'),
  curriculum: _joi.default.array().items(_joi.default.string().trim()).default([]).label('Chương trình đào tạo'),
  benchmarks: _joi.default.array().items(_joi.default.object({
    year: _joi.default.number().integer().required(),
    value: _joi.default.number().required(),
    quota: _joi.default.number().integer().optional()
  })).default([]).label('Điểm chuẩn'),
  employment_rate: _joi.default.string().trim().default('0%').label('Tỷ lệ có việc làm')
});
const updateItem = exports.updateItem = _joi.default.object({
  code: _joi.default.string().trim().max(50).required().label('Mã ngành').custom((value, helpers) => new _classes.AsyncValidate(value, async function (req) {
    const major = await _models.Major.findOne({
      code: value,
      _id: {
        $ne: req.major?._id || req.params?.id
      }
    });
    return !major ? value : helpers.error('any.exists');
  })),
  name: _joi.default.string().trim().max(150).required().label('Tên ngành'),
  major: _joi.default.string().trim().max(150).required().label('Chuyên ngành'),
  category: _joi.default.string().trim().max(100).required().label('Phương thức xét tuyển/Danh mục'),
  university_id: _joi.default.string().trim().regex(/^[0-9a-fA-F]{24}$/, 'ObjectId').required().label('ID trường đại học'),
  quota: _joi.default.number().integer().min(0).required().label('Chỉ tiêu'),
  description: _joi.default.string().trim().empty(_joi.default.valid('', null)).default('').label('Mô tả'),
  duration: _joi.default.string().valid('4 năm', '5 năm', '6 năm', '7 năm', '8 năm').default('4 năm').label('Thời gian đào tạo'),
  status: _joi.default.string().valid('active', 'inactive').default('active').label('Trạng thái'),
  groups: _joi.default.array().items(_joi.default.string().trim()).default([]).label('Khối xét tuyển'),
  careers: _joi.default.array().items(_joi.default.string().trim()).default([]).label('Cơ hội nghề nghiệp'),
  curriculum: _joi.default.array().items(_joi.default.string().trim()).default([]).label('Chương trình đào tạo'),
  benchmarks: _joi.default.array().items(_joi.default.object({
    year: _joi.default.number().integer().required(),
    value: _joi.default.number().required(),
    quota: _joi.default.number().integer().optional()
  })).default([]).label('Điểm chuẩn'),
  employment_rate: _joi.default.string().trim().default('0%').label('Tỷ lệ có việc làm')
});
const getList = exports.getList = _joi.default.object({
  q: (0, _helpers.tryValidateOrDefault)(_joi.default.string().trim(), ''),
  page: (0, _helpers.tryValidateOrDefault)(_joi.default.number().integer().min(1), 1),
  per_page: (0, _helpers.tryValidateOrDefault)(_joi.default.number().integer().min(1).max(100), 50),
  code: (0, _helpers.tryValidateOrDefault)(_joi.default.string().trim(), ''),
  name: (0, _helpers.tryValidateOrDefault)(_joi.default.string().trim(), ''),
  university_id: (0, _helpers.tryValidateOrDefault)(_joi.default.string().trim(), ''),
  category: (0, _helpers.tryValidateOrDefault)(_joi.default.string().trim(), ''),
  keyword: (0, _helpers.tryValidateOrDefault)(_joi.default.string().trim(), '')
});