"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verify = exports.reject = exports.getList = void 0;
var _admission = _interopRequireDefault(require("../../services/staff/admission.service"));
const getList = async (req, res) => {
  try {
    const query = req.query;
    const result = await _admission.default.getList(query);
    return res.status(200).json({
      success: true,
      message: 'Lấy danh sách hồ sơ xét tuyển thành công',
      data: result.data,
      pagination: result.pagination
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Lỗi server'
    });
  }
};
exports.getList = getList;
const verify = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const staffId = req.currentStaff._id;
    const application = await _admission.default.verifyApplication(id, staffId);
    return res.status(200).json({
      success: true,
      message: 'Xác minh hồ sơ thành công',
      data: application
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Lỗi server'
    });
  }
};
exports.verify = verify;
const reject = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const staffId = req.currentStaff._id;
    const {
      reason
    } = req.body;
    const application = await _admission.default.rejectApplication(id, staffId, reason);
    return res.status(200).json({
      success: true,
      message: 'Từ chối hồ sơ thành công',
      data: application
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Lỗi server'
    });
  }
};
exports.reject = reject;