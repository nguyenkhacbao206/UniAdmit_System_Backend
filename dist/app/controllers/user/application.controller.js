"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMyResult = exports.getMyApplications = exports.deleteApplication = exports.create = exports.confirmAdmission = void 0;
var _application = _interopRequireDefault(require("../../services/application.service"));
const create = async (req, res) => {
  try {
    const userId = req.currentUser._id;
    const data = req.body;
    const application = await _application.default.create(userId, data);
    return res.status(201).json({
      success: true,
      message: 'Đăng ký nguyện vọng thành công',
      data: application
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Lỗi server'
    });
  }
};
exports.create = create;
const getMyApplications = async (req, res) => {
  try {
    const userId = req.currentUser._id;
    const {
      round_id
    } = req.query;
    const applications = await _application.default.getMyApplications(userId, round_id);
    return res.status(200).json({
      success: true,
      message: 'Lấy danh sách nguyện vọng thành công',
      data: applications
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Lỗi server'
    });
  }
};
exports.getMyApplications = getMyApplications;
const getMyResult = async (req, res) => {
  try {
    const userId = req.currentUser._id;
    const {
      round_id
    } = req.query;
    const results = await _application.default.getMyResult(userId, round_id);
    return res.status(200).json({
      success: true,
      message: 'Lấy kết quả xét tuyển thành công',
      data: results
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Lỗi server'
    });
  }
};
exports.getMyResult = getMyResult;
const confirmAdmission = async (req, res) => {
  try {
    const userId = req.currentUser._id;
    const {
      applicationId
    } = req.body;
    const application = await _application.default.confirmAdmission(userId, applicationId);
    return res.status(200).json({
      success: true,
      message: 'Xác nhận nhập học thành công',
      data: application
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Lỗi server'
    });
  }
};
exports.confirmAdmission = confirmAdmission;
const deleteApplication = async (req, res) => {
  try {
    const userId = req.currentUser._id;
    const {
      id
    } = req.params;
    await _application.default.deleteApplication(userId, id);
    return res.status(200).json({
      success: true,
      message: 'Hủy đăng ký thành công'
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Lỗi server'
    });
  }
};
exports.deleteApplication = deleteApplication;