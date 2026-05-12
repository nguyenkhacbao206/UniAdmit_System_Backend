"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkPreferenceId = checkPreferenceId;
var _helpers = require("../../../utils/helpers");
var _mongoose = require("mongoose");
var _preference = _interopRequireDefault(require("../../../models/preference.js"));
async function checkPreferenceId(req, res, next) {
  const {
    id
  } = req.params;
  if ((0, _mongoose.isValidObjectId)(id)) {
    const preference = await _preference.default.findOne({
      _id: id,
      userId: req.currentUser._id
    });
    if (preference) {
      req.preference = preference;
      next();
      return;
    }
  }
  (0, _helpers.abort)(404, 'Không tìm thấy nguyện vọng này hoặc bạn không có quyền truy cập.');
}