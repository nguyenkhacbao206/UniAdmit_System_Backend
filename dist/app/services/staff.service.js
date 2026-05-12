"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateStaffService = exports.getStaffService = exports.getStaffBySearchService = exports.getStaffByPagesService = exports.getStaffByIdService = exports.deleteStaffService = exports.createStaffService = void 0;
var _models = require("../../models");
var _lodash = require("lodash");
var _helpers = require("../../utils/helpers");
const createStaffService = async data => {
  const {
    name,
    mail,
    phone,
    password,
    status
  } = data;
  const staff = await _models.Staff.create({
    name,
    mail,
    phone,
    password,
    status
  });
  return staff;
};
exports.createStaffService = createStaffService;
const getStaffService = async () => {
  const getStaff = await _models.Staff.find();
  if (!getStaff) {
    (0, _helpers.abort)(400, 'Không tìm thấy nhân viên');
  }
  return getStaff;
};
exports.getStaffService = getStaffService;
const getStaffByIdService = async id => {
  const getStaff = await _models.Staff.findById(id);
  if (!getStaff) {
    (0, _helpers.abort)(400, 'Không tìm thấy nhân viên');
  }
  return getStaff;
};
exports.getStaffByIdService = getStaffByIdService;
const updateStaffService = async (id, data) => {
  const updateStaff = await _models.Staff.findByIdAndUpdate(id, data, {
    new: true
  });
  if (!updateStaff) {
    (0, _helpers.abort)(400, 'Không tìm thấy nhân viên');
  }
  return updateStaff;
};
exports.updateStaffService = updateStaffService;
const deleteStaffService = async id => {
  const deleteStaff = await _models.Staff.findByIdAndDelete(id);
  if (!deleteStaff) {
    (0, _helpers.abort)(400, 'Không tìm thấy nhân viên');
  }
  return deleteStaff;
};
exports.deleteStaffService = deleteStaffService;
const getStaffBySearchService = async data => {
  const {
    name,
    mail,
    phone
  } = data;
  const query = {};
  if (name) {
    query.name = {
      $regex: name,
      $options: 'i'
    };
  }
  if (mail) {
    query.mail = {
      $regex: mail,
      $options: 'i'
    };
  }
  if (phone) {
    query.phone = {
      $regex: phone,
      $options: 'i'
    };
  }
  const staff = await _models.Staff.find(query);
  return staff;
};
exports.getStaffBySearchService = getStaffBySearchService;
const getStaffByPagesService = async data => {
  const {
    page = 1,
    limit = 10
  } = data;
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;
  const staff = await _models.Staff.find().skip(skip).limit(limit);
  const total = await _models.Staff.countDocuments();
  return {
    staff,
    total,
    page,
    limit,
    totalPage: Math.ceil(total / limit)
  };
};
exports.getStaffByPagesService = getStaffByPagesService;