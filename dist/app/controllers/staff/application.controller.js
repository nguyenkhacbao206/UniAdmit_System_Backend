"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateStatus = exports.getList = void 0;
var _applicationService = _interopRequireDefault(require("../../services/staff/application.service.js"));
const getList = async (req, res) => {
  try {
    const data = await _applicationService.default.getList(req.query);
    res.json({
      success: true,
      ...data
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
exports.getList = getList;
const updateStatus = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const {
      status,
      message
    } = req.body;
    const staffId = req.currentStaff?._id || req.currentAdmin?._id;
    const data = await _applicationService.default.updateStatus(id, status, message, staffId);
    res.json({
      success: true,
      data,
      message: 'Cập nhật trạng thái thành công'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
exports.updateStatus = updateStatus;