"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateUniversitiesController = exports.getUniversityBySearch = exports.getUniversityByPage = exports.getUniversityByIdController = exports.getUniversitiesController = exports.deleteUniversitiesController = exports.createUniversitiesController = void 0;
var universitiesService = _interopRequireWildcard(require("../../services/universities.service"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const createUniversitiesController = async (req, res) => {
  try {
    const data = req.body;
    const createUniversity = await universitiesService.createUniversity(data);
    return res.status(200).json({
      success: true,
      message: 'Tạo trường thành công',
      data: createUniversity
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Lỗi server'
    });
  }
};
exports.createUniversitiesController = createUniversitiesController;
const getUniversitiesController = async (req, res) => {
  try {
    const getUniversity = await universitiesService.getUniversity();
    return res.status(200).json({
      success: true,
      message: 'Lấy danh sách trường thành công',
      data: getUniversity
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Lỗi server'
    });
  }
};
exports.getUniversitiesController = getUniversitiesController;
const getUniversityByIdController = async (req, res) => {
  try {
    const id = req.params.id;
    const getUniversityById = await universitiesService.getUniversityById(id);
    return res.status(200).json({
      success: true,
      message: 'Lấy thông tin trường thành công',
      data: getUniversityById
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Lỗi server'
    });
  }
};
exports.getUniversityByIdController = getUniversityByIdController;
const updateUniversitiesController = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const updateUniversity = await universitiesService.updateUniversity(id, data);
    return res.status(200).json({
      success: true,
      message: 'cập nhật trường thành công',
      data: updateUniversity
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Lỗi server'
    });
  }
};
exports.updateUniversitiesController = updateUniversitiesController;
const deleteUniversitiesController = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteUniversity = await universitiesService.deleteUniversity(id);
    return res.status(200).json({
      success: true,
      message: 'Xóa trường thành công',
      data: deleteUniversity
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Lỗi server'
    });
  }
};
exports.deleteUniversitiesController = deleteUniversitiesController;
const getUniversityBySearch = async (req, res) => {
  try {
    const data = req.query;
    const getUniversityBySearch = await universitiesService.getUniversityBySearch(data);
    return res.status(200).json({
      success: true,
      message: 'search thành công',
      data: getUniversityBySearch
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Lỗi server'
    });
  }
};
exports.getUniversityBySearch = getUniversityBySearch;
const getUniversityByPage = async (req, res) => {
  try {
    const {
      page,
      limit
    } = req.query;
    const getPage = await universitiesService.getUniversityByPages({
      page,
      limit
    });
    const result = res.status(200).json({
      success: true,
      message: '',
      data: {
        result: getPage.university,
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
exports.getUniversityByPage = getUniversityByPage;