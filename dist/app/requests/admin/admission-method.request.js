"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateItem = exports.getList = exports.createItem = void 0;
var _models = require("../../../models");
var _classes = require("../../../utils/classes");
var _joi = _interopRequireDefault(require("joi"));
const createItem = exports.createItem = _joi.default.object({
  code: _joi.default.string().trim().required().max(50).label('Mã tuyển sinh').custom((value, helpers) => new _classes.AsyncValidate(value, async function () {
    const admissionMethod = await _models.AdmissionMethod.findOne({
      code: value
    });
    return !admissionMethod ? value : helpers.error('any.exists');
  })),
  methodName: _joi.default.string().trim().required().max(100).label('Tên phương thức tuyển sinh'),
  description: _joi.default.string().trim().required().max(500).label('Mô tả'),
  status: _joi.default.string().valid('Active', 'Inactive').default('Active').label('Trạng thái')
});
const updateItem = exports.updateItem = _joi.default.object({
  code: _joi.default.string().trim().max(50).label('Mã tuyển sinh'),
  methodName: _joi.default.string().trim().max(100).label('Tên phương thức tuyển sinh'),
  description: _joi.default.string().trim().max(500).label('Mô tả'),
  status: _joi.default.string().valid('Active', 'Inactive').label('Trạng thái')
});
const getList = exports.getList = _joi.default.object({
  code: _joi.default.string().trim().label('Mã tuyển sinh'),
  method: _joi.default.string().trim().label('Tên phương thức'),
  description: _joi.default.string().trim().label('Mô tả'),
  status: _joi.default.string().valid('Active', 'Inactive').label('Trạng thái')
});