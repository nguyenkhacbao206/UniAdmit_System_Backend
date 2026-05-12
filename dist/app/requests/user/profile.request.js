"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateProfile = void 0;
var _joi = _interopRequireDefault(require("joi"));
var _configs = require("../../../configs");
var _models = require("../../../models");
var _classes = require("../../../utils/classes");
const updateProfile = exports.updateProfile = _joi.default.object({
  name: _joi.default.string().pattern(_configs.VALIDATE_FULL_NAME_REGEX).max(50).label('Họ tên'),
  email: _joi.default.string().pattern(_configs.VALIDATE_EMAIL_REGEX).label('Email').custom((value, helpers) => new _classes.AsyncValidate(value, async function (req) {
    if (!value) return value;
    const existingUser = await _models.User.findOne({
      email: value,
      _id: {
        $ne: req.currentUser._id
      },
      deleted: false
    });
    return !existingUser ? value : helpers.error('any.exists');
  })),
  phone: _joi.default.string().pattern(_configs.VALIDATE_PHONE_REGEX).label('Số điện thoại').allow('').custom((value, helpers) => new _classes.AsyncValidate(value, async function (req) {
    if (!value) return value;
    const existingUser = await _models.User.findOne({
      phone: value,
      _id: {
        $ne: req.currentUser._id
      },
      deleted: false
    });
    return !existingUser ? value : helpers.error('any.exists');
  })),
  gender: _joi.default.string().valid('male', 'female', 'other', '').label('Giới tính'),
  dob: _joi.default.date().allow(null, '').label('Ngày sinh'),
  address: _joi.default.string().max(200).allow('').label('Địa chỉ'),
  ethnicity: _joi.default.string().max(50).allow('').label('Dân tộc'),
  permanentAddress: _joi.default.string().max(200).allow('').label('Địa chỉ thường trú'),
  contactAddress: _joi.default.string().max(200).allow('').label('Địa chỉ liên lạc'),
  cccd: _joi.default.string().max(20).allow('').label('Số CCCD/CMND'),
  place_of_issue: _joi.default.string().max(100).allow('').label('Nơi cấp'),
  avatar: _joi.default.any().allow('').label('Ảnh đại diện'),
  cv: _joi.default.any().allow('').label('CV'),
  school: _joi.default.string().max(200).allow('').label('Trường học'),
  score: _joi.default.number().min(0).max(10).allow(null, 0).label('Điểm số'),
  rank: _joi.default.string().max(50).allow('').label('Xếp loại/Học lực')
});