"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkUniversityId = checkUniversityId;
var _models = require("../../../models");
var _helpers = require("../../../utils/helpers");
var _mongoose = require("mongoose");
async function checkUniversityId(req, res, next) {
  if ((0, _mongoose.isValidObjectId)(req.params.id)) {
    const university = await _models.University.findById(req.params.id);
    if (university) {
      req.university = university;
      next();
      return;
    }
  }
  (0, _helpers.abort)(404, 'Không tìm thấy trường đại học.');
}