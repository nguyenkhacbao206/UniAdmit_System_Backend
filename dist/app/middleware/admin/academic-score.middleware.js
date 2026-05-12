"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkAcademicScoreId = checkAcademicScoreId;
var _models = require("../../../models");
var _helpers = require("../../../utils/helpers");
var _mongoose = require("mongoose");
async function checkAcademicScoreId(req, res, next) {
  const defaultId = req.params.id || req.params.academicScoreId;
  if ((0, _mongoose.isValidObjectId)(defaultId)) {
    const academicScore = await _models.AcademicScore.findById(defaultId);
    if (academicScore) {
      req.academicScoreData = academicScore;
      next();
      return;
    }
  }
  (0, _helpers.abort)(404, 'Không tìm thấy điểm học bạ (Academic Score) này.');
}