"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleAction = exports.getList = exports.createRequest = void 0;
var _supplementService = _interopRequireDefault(require("../../services/staff/supplement.service.js"));
const getList = async (req, res) => {
  try {
    const data = await _supplementService.default.getList(req.query);
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
const createRequest = async (req, res) => {
  try {
    const staffId = req.currentStaff?._id || req.currentAdmin?._id;
    const data = await _supplementService.default.createRequest(req.body, staffId);
    res.json({
      success: true,
      data,
      message: 'Tạo yêu cầu bổ sung thành công'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
exports.createRequest = createRequest;
const handleAction = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const {
      action,
      message
    } = req.body;
    const data = await _supplementService.default.handleAction(id, action, message);
    res.json({
      success: true,
      data,
      message: action === 'approve' ? 'Đã phê duyệt bổ sung' : 'Đã từ chối bổ sung'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
exports.handleAction = handleAction;