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
  code: _joi.default.string().trim().max(50).required().label('Mã trường').custom((value, helpers) => new _classes.AsyncValidate(value, async function () {
    const university = await _models.University.findOne({
      code: value
    });
    return !university ? value : helpers.error('any.exists');
  })),
  name: _joi.default.string().trim().max(150).required().label('Tên trường'),
  location: _joi.default.string().trim().empty(_joi.default.valid('', null)).default('').label('Địa điểm'),
  majors: _joi.default.number().integer().min(0).empty(_joi.default.valid('', null)).default(0).label('Số lượng ngành'),
  status: _joi.default.string().valid('active', 'inactive').default('active').label('Trạng thái')
});
const updateItem = exports.updateItem = _joi.default.object({
  code: _joi.default.string().trim().max(50).required().label('Mã trường').custom((value, helpers) => new _classes.AsyncValidate(value, async function (req) {
    const university = await _models.University.findOne({
      code: value,
      _id: {
        $ne: req.university._id
      }
    });
    return !university ? value : helpers.error('any.exists');
  })),
  name: _joi.default.string().trim().max(150).required().label('Tên trường'),
  location: _joi.default.string().trim().empty(_joi.default.valid('', null)).default('').label('Địa điểm'),
  majors: _joi.default.number().integer().min(0).empty(_joi.default.valid('', null)).default(0).label('Số lượng ngành'),
  status: _joi.default.string().valid('active', 'inactive').default('active').label('Trạng thái')
});
const getList = exports.getList = _joi.default.object({
  q: (0, _helpers.tryValidateOrDefault)(_joi.default.string().trim(), ''),
  page: (0, _helpers.tryValidateOrDefault)(_joi.default.number().integer().min(1), 1),
  per_page: (0, _helpers.tryValidateOrDefault)(_joi.default.number().integer().min(1).max(100), 50)
});