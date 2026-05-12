"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkEnrollmentId = void 0;
var _models = require("../../../models");
var _helpers = require("../../../utils/helpers");
var _mongoose = require("mongoose");
const checkEnrollmentId = async (req, res, next) => {
  const defaultId = req.params.id;
  if ((0, _mongoose.isValidObjectId)(defaultId)) {
    const enrollment = await _models.Enrollment.findById(defaultId);
    if (enrollment) {
      req.enrollment = enrollment;
      next();
      return;
    }
  }
  (0, _helpers.abort)(404, 'không tìm thấy đợi tuyển sinh');
};
exports.checkEnrollmentId = checkEnrollmentId;