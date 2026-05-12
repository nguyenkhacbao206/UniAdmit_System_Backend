"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.submit = exports.getSummary = void 0;
var _enrollment = _interopRequireDefault(require("../../services/enrollment.service"));
const getSummary = async (req, res) => {
  try {
    const userId = req.currentUser._id;
    const data = await _enrollment.default.getSummary(userId);
    res.json({
      success: true,
      data
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
exports.getSummary = getSummary;
const submit = async (req, res) => {
  try {
    const userId = req.currentUser._id;
    await _enrollment.default.submit(userId);
    res.json({
      success: true,
      message: 'Nộp hồ sơ thành công'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
exports.submit = submit;