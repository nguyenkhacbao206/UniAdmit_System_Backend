"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unlock = exports.reorder = exports.remove = exports.getResult = exports.getList = exports.confirm = exports.add = void 0;
var _preferenceService = _interopRequireDefault(require("../../services/preference.service.js"));
const getList = async (req, res) => {
  try {
    const userId = req.currentUser._id;
    const data = await _preferenceService.default.getByUser(userId);
    res.json({
      success: true,
      isConfirmed: req.currentUser.isConfirmed,
      data
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
exports.getList = getList;
const add = async (req, res) => {
  try {
    const userId = req.currentUser._id;
    const data = await _preferenceService.default.addPreference(userId, req.body);
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
exports.add = add;
const remove = async (req, res) => {
  try {
    const userId = req.currentUser._id;
    const {
      id
    } = req.params;
    await _preferenceService.default.deletePreference(userId, id);
    res.json({
      success: true,
      message: 'Xóa thành công'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
exports.remove = remove;
const reorder = async (req, res) => {
  try {
    const userId = req.currentUser._id;
    const {
      list
    } = req.body;
    await _preferenceService.default.reorder(userId, list);
    res.json({
      success: true,
      message: 'Reorder thành công'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
exports.reorder = reorder;
const confirm = async (req, res) => {
  try {
    const userId = req.currentUser._id;
    await _preferenceService.default.confirm(userId);
    res.json({
      success: true,
      message: 'Đã xác nhận nguyện vọng'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
exports.confirm = confirm;
const unlock = async (req, res) => {
  try {
    const userId = req.currentUser._id;
    await _preferenceService.default.unlock(userId);
    res.json({
      success: true,
      message: 'Đã mở khóa danh sách nguyện vọng'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
exports.unlock = unlock;
const getResult = async (req, res) => {
  try {
    const userId = req.currentUser._id;
    const result = await _preferenceService.default.getResult(userId);
    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
exports.getResult = getResult;