"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateMajorController = exports.getMajorController = exports.getMajorBySearchController = exports.getMajorByPage = exports.getMajorByIdController = exports.daleteMajorController = exports.createMajorController = void 0;
var MajorService = _interopRequireWildcard(require("../../services/major.service"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const createMajorController = async (req, res) => {
  try {
    const data = req.body;
    const major = await MajorService.createMajorService(data);
    return res.json({
      success: true,
      message: 'Tạo ngành học thành công',
      data: major
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Lỗi server'
    });
  }
};
exports.createMajorController = createMajorController;
const getMajorController = async (req, res) => {
  try {
    const major = await MajorService.getMajorService();
    return res.json({
      success: true,
      message: 'Lấy danh sách ngành học thành công',
      data: major
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Lỗi server'
    });
  }
};
exports.getMajorController = getMajorController;
const getMajorByIdController = async (req, res) => {
  try {
    const id = req.params.id;
    const majorId = await MajorService.getMajorByIdService(id);
    return res.json({
      success: true,
      message: 'Lấy thông tin ngành học thành công',
      data: majorId
    });
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Lỗi server',
      error: err.stack
    });
  }
};
exports.getMajorByIdController = getMajorByIdController;
const updateMajorController = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const updateData = await MajorService.updateMajorService(id, data);
    const newData = res.status(200).json({
      success: true,
      message: 'Cập nhật ngành học thành công',
      data: updateData
    });
    return newData;
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Lỗi server'
    });
  }
};
exports.updateMajorController = updateMajorController;
const daleteMajorController = async (req, res) => {
  try {
    const id = req.params.id;
    const deleData = await MajorService.deleteMajorService(id);
    const newData = res.status(200).json({
      success: true,
      message: 'Xóa ngành học thành công',
      data: deleData
    });
    return newData;
  } catch (err) {
    return res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Lỗi server',
      error: err.stack
    });
  }
};
exports.daleteMajorController = daleteMajorController;
const getMajorBySearchController = async (req, res) => {
  try {
    const data = req.query;
    const majorSearch = await MajorService.getMajorBySearch(data);
    const searchData = res.status(200).json({
      success: true,
      message: 'Lấy danh sách ngành học thành công',
      data: majorSearch
    });
    return searchData;
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Lỗi server'
    });
  }
};
exports.getMajorBySearchController = getMajorBySearchController;
const getMajorByPage = async (req, res) => {
  try {
    const {
      page,
      limit
    } = req.query;
    const getPage = await MajorService.getMajorByPages({
      page,
      limit
    });
    const result = res.status(200).json({
      success: true,
      message: '',
      data: {
        result: getPage.major,
        total: getPage.total
      }
    });
    return result;
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Lỗi server'
    });
  }
};
exports.getMajorByPage = getMajorByPage;