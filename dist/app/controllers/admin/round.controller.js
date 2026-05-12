"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateStatus = exports.update = exports.remove = exports.getByPage = exports.getById = exports.getAll = exports.create = void 0;
var _round = _interopRequireDefault(require("../../services/round.service"));
const getAll = async (req, res) => {
  try {
    const data = await _round.default.getAll();
    return res.status(200).json({
      success: true,
      message: 'Lấy danh sách đợt tuyển sinh thành công',
      data
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Lỗi server'
    });
  }
};
exports.getAll = getAll;
const getById = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const data = await _round.default.getById(id);
    return res.status(200).json({
      success: true,
      message: 'Lấy thông tin đợt tuyển sinh thành công',
      data
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Lỗi server'
    });
  }
};
exports.getById = getById;
const create = async (req, res) => {
  try {
    const data = req.body;
    const round = await _round.default.create(data);
    return res.status(201).json({
      success: true,
      message: 'Tạo đợt tuyển sinh thành công',
      data: round
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Lỗi server'
    });
  }
};
exports.create = create;
const update = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const data = req.body;
    const round = await _round.default.update(id, data);
    return res.status(200).json({
      success: true,
      message: 'Cập nhật đợt tuyển sinh thành công',
      data: round
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Lỗi server'
    });
  }
};
exports.update = update;
const updateStatus = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const {
      status
    } = req.body;
    const round = await _round.default.updateStatus(id, status);
    return res.status(200).json({
      success: true,
      message: 'Cập nhật trạng thái đợt tuyển sinh thành công',
      data: round
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Lỗi server'
    });
  }
};
exports.updateStatus = updateStatus;
const remove = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    await _round.default.delete(id);
    return res.status(200).json({
      success: true,
      message: 'Xóa đợt tuyển sinh thành công'
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Lỗi server'
    });
  }
};
exports.remove = remove;
const getByPage = async (req, res) => {
  try {
    const query = req.query;
    const {
      result,
      total
    } = await _round.default.getByPage(query);
    return res.status(200).json({
      success: true,
      message: 'Lấy danh sách đợt tuyển sinh thành công',
      data: {
        result,
        total
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Lỗi server'
    });
  }
};
exports.getByPage = getByPage;