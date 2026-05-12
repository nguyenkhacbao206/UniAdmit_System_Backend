"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateStaffController = exports.getStaffController = exports.getStaffBySearchController = exports.getStaffByPagesController = exports.getStaffByIdController = exports.deleteStaffController = exports.createStaffController = void 0;
var StaffService = _interopRequireWildcard(require("../../services/staff.service"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const createStaffController = async (req, res) => {
  try {
    const data = req.body;
    const staff = await StaffService.createStaffService(data);
    return res.json({
      success: true,
      message: 'Thêm nhân viên thành công',
      data: staff
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống'
    });
  }
};
exports.createStaffController = createStaffController;
const getStaffController = async (req, res) => {
  try {
    const staff = await StaffService.getStaffService();
    return res.json({
      success: true,
      message: 'Lấy danh sách nhân viên thành công',
      data: staff
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống'
    });
  }
};
exports.getStaffController = getStaffController;
const getStaffByIdController = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const staff = await StaffService.getStaffByIdService(id);
    return res.json({
      success: true,
      message: 'Lấy thông tin nhân viên thành công',
      data: staff
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống'
    });
  }
};
exports.getStaffByIdController = getStaffByIdController;
const updateStaffController = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const data = req.body;
    const staff = await StaffService.updateStaffService(id, data);
    return res.json({
      success: true,
      message: 'Cập nhật thông tin nhân viên thành công',
      data: staff
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống'
    });
  }
};
exports.updateStaffController = updateStaffController;
const deleteStaffController = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const staff = await StaffService.deleteStaffService(id);
    return res.json({
      success: true,
      message: 'Xóa nhân viên thành công',
      data: staff
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống'
    });
  }
};
exports.deleteStaffController = deleteStaffController;
const getStaffBySearchController = async (req, res) => {
  try {
    const data = req.body;
    const staff = await StaffService.getStaffBySearchService(data);
    return res.json({
      success: true,
      message: 'Tìm kiếm nhân viên thành công',
      data: staff
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống'
    });
  }
};
exports.getStaffBySearchController = getStaffBySearchController;
const getStaffByPagesController = async (req, res) => {
  try {
    const data = req.body;
    const staff = await StaffService.getStaffByPagesService(data);
    return res.json({
      success: true,
      message: 'Lấy danh sách nhân viên theo trang thành công',
      data: staff
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống'
    });
  }
};
exports.getStaffByPagesController = getStaffByPagesController;