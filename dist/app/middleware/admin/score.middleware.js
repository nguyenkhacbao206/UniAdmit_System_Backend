"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkScoreId = checkScoreId;
var _models = require("../../../models");
var _helpers = require("../../../utils/helpers");
var _mongoose = require("mongoose");
async function checkScoreId(req, res, next) {
  const defaultId = req.params.id || req.params.scoreId;
  if ((0, _mongoose.isValidObjectId)(defaultId)) {
    const score = await _models.Score.findById(defaultId);
    if (score) {
      req.scoreData = score;
      next();
      return;
    }
  }
  (0, _helpers.abort)(404, 'Không tìm thấy điểm thi (Score) này.');
}