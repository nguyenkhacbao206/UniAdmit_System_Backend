"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runAdmission = exports.publishResult = exports.getStatistics = void 0;
var _admission = _interopRequireDefault(require("../../services/admission.service"));
const runAdmission = async (req, res) => {
  try {
    const {
      round_id
    } = req.body;
    if (!round_id) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn đợt tuyển sinh'
      });
    }
    const result = await _admission.default.runAdmission(round_id);
    return res.status(200).json({
      success: true,
      message: 'Chạy xét tuyển thành công',
      data: result
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Lỗi server'
    });
  }
};
exports.runAdmission = runAdmission;
const publishResult = async (req, res) => {
  try {
    const {
      round_id
    } = req.body;
    const adminId = req.currentAdmin._id;
    if (!round_id) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn đợt tuyển sinh'
      });
    }
    const result = await _admission.default.publishResult(round_id, adminId);
    return res.status(200).json({
      success: true,
      message: 'Công bố kết quả xét tuyển thành công',
      data: result
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Lỗi server'
    });
  }
};
exports.publishResult = publishResult;
const getStatistics = async (req, res) => {
  try {
    const {
      round_id
    } = req.query;
    if (!round_id) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn đợt tuyển sinh'
      });
    }
    const stats = await _admission.default.getStatistics(round_id);
    return res.status(200).json({
      success: true,
      message: 'Lấy thống kê xét tuyển thành công',
      data: stats
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Lỗi server'
    });
  }
};
exports.getStatistics = getStatistics;