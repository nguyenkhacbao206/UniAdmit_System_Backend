"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateUniversity = exports.getUniversityBySearch = exports.getUniversityByPages = exports.getUniversityById = exports.getUniversity = exports.deleteUniversity = exports.createUniversity = void 0;
var _models = require("../../models");
var _helpers = require("../../utils/helpers");
const createUniversity = async data => {
  const {
    code,
    name,
    location,
    majors,
    status
  } = data;
  const university = await _models.University.create({
    code,
    name,
    location,
    majors,
    status
  });
  return university;
};
exports.createUniversity = createUniversity;
const getUniversity = async () => {
  const university = await _models.University.find();
  if (!university) {
    (0, _helpers.abort)(404, 'Không tìm thấy trường đại học.');
  }
  return university;
};
exports.getUniversity = getUniversity;
const getUniversityById = async id => {
  const university = await _models.University.findById(id);
  if (!university) {
    (0, _helpers.abort)(404, 'Không tìm thấy trường đại học.');
  }
  return university;
};
exports.getUniversityById = getUniversityById;
const updateUniversity = async (id, data) => {
  const university = await _models.University.findByIdAndUpdate(id, data, {
    new: true
  });
  if (!university) {
    (0, _helpers.abort)(404, 'Không tìm thấy trường đại học.');
  }
  return university;
};
exports.updateUniversity = updateUniversity;
const deleteUniversity = async id => {
  const university = await _models.University.findByIdAndDelete(id);
  if (!university) {
    (0, _helpers.abort)(404, 'Không tìm thấy trường đại học.');
  }
  return university;
};
exports.deleteUniversity = deleteUniversity;
const getUniversityBySearch = async data => {
  const {
    name,
    location,
    code
  } = data;
  const query = {};
  if (name) {
    query.name = {
      $regex: name,
      $options: 'i'
    };
  }
  if (location) {
    query.location = {
      $regex: location,
      $options: 'i'
    };
  }
  if (code) {
    query.code = {
      $regex: code,
      $options: 'i'
    };
  }
  const university = await _models.University.find(query);
  return university;
};
exports.getUniversityBySearch = getUniversityBySearch;
const getUniversityByPages = async data => {
  const {
    page = 1,
    limit = 10
  } = data;
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;
  const university = await _models.University.find().skip(skip).limit(limit);
  const total = await _models.University.countDocuments();
  return {
    university,
    total,
    page,
    limit,
    totalPage: Math.ceil(total / limit)
  };
};
exports.getUniversityByPages = getUniversityByPages;