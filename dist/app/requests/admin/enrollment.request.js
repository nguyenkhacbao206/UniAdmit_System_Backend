"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateRequest = exports.getList = exports.createRequest = void 0;
var _classes = require("../../../utils/classes");
var _helpers = require("../../../utils/helpers");
var _joi = _interopRequireDefault(require("joi"));
var _models = require("../../../models");
const createRequest = exports.createRequest = _joi.default.object({
  code: _joi.default.string().required().trim().max(50).label('Mã ngành').custom((value, helpers) => new _classes.AsyncValidate(value, async function () {
    const enrollment = await _models.Enrollment.findOne({
      code: value
    });
    return !enrollment ? value : helpers.error('any.exists');
  })),
  name: _joi.default.string().required().max(50).label('Tên đợt tuyển sinh'),
  year: _joi.default.number().required().label('Năm tuyển sinh'),
  status: _joi.default.string().valid('open', 'close').default('open').label('Trạng thái tuyển sinh'),
  startDate: _joi.default.date().required().label('Ngày bắt đầu tuyển sinh'),
  endDate: _joi.default.date().required().label('Ngày kết thúc tuyển sinh')
});
const updateRequest = exports.updateRequest = _joi.default.object({
  code: _joi.default.string().trim().required().max(50).label('Mã tuyển sinh').custom((value, helpers) => new _classes.AsyncValidate(value, async function (req) {
    const major = await _models.Enrollment.findOne({
      code: value,
      _id: {
        $ne: req.major?._id || req.params?.id
      }
    });
    return !major ? value : helpers.error('any.exists');
  })),
  name: _joi.default.string().trim().required().max(50).label('Tên đợt tuyển sinh'),
  year: _joi.default.number().required().label('Năm tuyển sinh'),
  status: _joi.default.string().valid('open', 'close').default('open').label('Trạng thái tuyển sinh'),
  startDate: _joi.default.date().required().label('Ngày bắt đầu tuyển sinh'),
  endDate: _joi.default.date().required().label('Ngày kết thúc tuyển sinh')
});
const getList = exports.getList = _joi.default.object({
  q: (0, _helpers.tryValidateOrDefault)(_joi.default.string().trim(), ''),
  page: (0, _helpers.tryValidateOrDefault)(_joi.default.number().integer().min(1), 1),
  per_page: (0, _helpers.tryValidateOrDefault)(_joi.default.number().integer().min(1).max(100), 50),
  code: (0, _helpers.tryValidateOrDefault)(_joi.default.string().trim(), ''),
  name: (0, _helpers.tryValidateOrDefault)(_joi.default.string().trim(), '')
});