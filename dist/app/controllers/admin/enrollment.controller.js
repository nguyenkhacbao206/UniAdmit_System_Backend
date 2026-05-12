"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateEnrollmentController = exports.getEnrollmentController = exports.getEnrollmentBySearchController = exports.getEnrollmentByPage = exports.getEnrollmentByIdController = exports.deleteEnrollmentController = exports.createEnollmentController = void 0;
var _enrollment = _interopRequireDefault(require("../../services/enrollment.service"));
const createEnollmentController = async (req, res) => {
  try {
    const data = req.body;
    const createData = await _enrollment.default.createEnrollmentService(data);
    const result = res.status(200).json({
      success: true,
      message: 'Tạo đợi tuyển sinh',
      data: createData
    });
    return result;
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'lỗi server'
    });
  }
};
exports.createEnollmentController = createEnollmentController;
const getEnrollmentController = async (req, res) => {
  try {
    const getData = await _enrollment.default.getEnrollmentService();
    const result = res.status(200).json({
      success: true,
      message: 'lấy danh sách tuyển sinh thành công',
      data: getData
    });
    return result;
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'lỗi server'
    });
  }
};
exports.getEnrollmentController = getEnrollmentController;
const getEnrollmentByIdController = async (req, res) => {
  try {
    const id = req.params.id;
    const getDataById = await _enrollment.default.getEnrollmentByIdService(id);
    const result = res.status(200).json({
      success: true,
      message: 'lấy thông tin tuyển sinh thành công',
      data: getDataById
    });
    return result;
  } catch (err) {
    res.status(500).json({
      success: false,
      messgae: err.message || 'Lỗi server'
    });
  }
};
exports.getEnrollmentByIdController = getEnrollmentByIdController;
const updateEnrollmentController = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const updateData = await _enrollment.default.updateEnrollment(id, data);
    const result = res.status(200).json({
      success: true,
      message: 'Cập nhật thành công đợt tuyển sinh',
      data: updateData
    });
    return result;
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Lỗi server'
    });
  }
};
exports.updateEnrollmentController = updateEnrollmentController;
const deleteEnrollmentController = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteData = await _enrollment.default.deleteEnrollment(id);
    const result = res.status(200).json({
      success: true,
      message: 'Xóa thành công đợt tuyển sinh',
      data: deleteData
    });
    return result;
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Lỗi server'
    });
  }
};
exports.deleteEnrollmentController = deleteEnrollmentController;
const getEnrollmentBySearchController = async (req, res) => {
  try {
    const data = req.query;
    const searchData = await _enrollment.default.getEnrollmentBySearch(data);
    const result = res.status(200).json({
      success: true,
      message: 'search thành công',
      data: searchData
    });
    return result;
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Lỗi server'
    });
  }
};
exports.getEnrollmentBySearchController = getEnrollmentBySearchController;
const getEnrollmentByPage = async (req, res) => {
  try {
    const {
      page,
      limit
    } = req.query;
    const enrollmentPage = await _enrollment.default.getEnrollmentByPages(page, limit);
    return res.status(200).json({
      success: true,
      message: '',
      data: {
        result: enrollmentPage.enrollment,
        total: enrollmentPage.total
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Lỗi server'
    });
  }
};
exports.getEnrollmentByPage = getEnrollmentByPage;