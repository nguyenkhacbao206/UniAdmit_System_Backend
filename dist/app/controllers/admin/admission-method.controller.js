"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateAdmissionMethodController = exports.getAdmissionMethodController = exports.getAdmissionMethodBySearchController = exports.getAdmissionMethodByPagesController = exports.getAdmissionMethodByIdController = exports.deleteAdmissionMethodController = exports.createAdmissionMethodController = void 0;
var admissionMethodService = _interopRequireWildcard(require("../../services/admission-method.service"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const createAdmissionMethodController = async (req, res) => {
  try {
    const data = req.body;
    const getData = await admissionMethodService.createAdmissionMethodService(data);
    const result = res.status(200).json({
      success: true,
      message: 'thêm phương thức tuyển sinh thành công',
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
exports.createAdmissionMethodController = createAdmissionMethodController;
const getAdmissionMethodController = async (req, res) => {
  try {
    const getData = await admissionMethodService.getAdmissionMethodService();
    const result = res.status(200).json({
      success: true,
      message: 'lấy danh sách phương thức tuyển sinh thành công',
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
exports.getAdmissionMethodController = getAdmissionMethodController;
const getAdmissionMethodByIdController = async (req, res) => {
  try {
    const {
      admissionMethodId
    } = req.params;
    const getData = await admissionMethodService.getAdmissionMethodByIdService(admissionMethodId);
    const result = res.status(200).json({
      success: true,
      message: 'lấy phương thức tuyển sinh thành công',
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
exports.getAdmissionMethodByIdController = getAdmissionMethodByIdController;
const updateAdmissionMethodController = async (req, res) => {
  try {
    const {
      admissionMethodId
    } = req.params;
    const data = req.body;
    const getData = await admissionMethodService.updateAdmissionMethod(admissionMethodId, data);
    const result = res.status(200).json({
      success: true,
      message: 'cập nhật phương thức tuyển sinh thành công',
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
exports.updateAdmissionMethodController = updateAdmissionMethodController;
const deleteAdmissionMethodController = async (req, res) => {
  try {
    const {
      admissionMethodId
    } = req.params;
    const getData = await admissionMethodService.deleteAdmissionMethod(admissionMethodId);
    const result = res.status(200).json({
      success: true,
      message: 'xóa phương thức tuyển sinh thành công',
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
exports.deleteAdmissionMethodController = deleteAdmissionMethodController;
const getAdmissionMethodBySearchController = async (req, res) => {
  try {
    const data = req.query;
    const getData = await admissionMethodService.getAdmissionMethodBySearch(data);
    const result = res.status(200).json({
      success: true,
      message: 'tìm kiếm phương thức tuyển sinh thành công',
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
exports.getAdmissionMethodBySearchController = getAdmissionMethodBySearchController;
const getAdmissionMethodByPagesController = async (req, res) => {
  try {
    const data = req.query;
    const getData = await admissionMethodService.getAdmissionMethodByPages(data);
    const result = res.status(200).json({
      success: true,
      message: 'lấy phương thức tuyển sinh theo trang thành công',
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
exports.getAdmissionMethodByPagesController = getAdmissionMethodByPagesController;