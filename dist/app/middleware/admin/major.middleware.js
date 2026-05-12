"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkMajorId = checkMajorId;
var _models = require("../../../models");
var _helpers = require("../../../utils/helpers");
var _mongoose = require("mongoose");
async function checkMajorId(req, res, next) {
  const defaultId = req.params.id;
  if ((0, _mongoose.isValidObjectId)(defaultId)) {
    const major = await _models.Major.findById(defaultId);
    if (major) {
      req.major = major;
      next();
      return;
    }
  }
  (0, _helpers.abort)(404, 'Không tìm thấy ngành học.');
}