"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.submitResponse = exports.getMyRequests = void 0;
var _supplementService = _interopRequireDefault(require("../../services/staff/supplement.service.js"));
const getMyRequests = async (req, res) => {
  try {
    const userId = req.currentUser._id;
    const data = await _supplementService.default.getUserRequests(userId);
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
exports.getMyRequests = getMyRequests;
const submitResponse = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const userId = req.currentUser._id;
    console.log('Submit Response Hit:', {
      id,
      userId
    });
    const data = await _supplementService.default.submitResponse(id, userId, req.body);
    res.json({
      success: true,
      data,
      message: 'Đã gửi phản hồi bổ sung hồ sơ'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
exports.submitResponse = submitResponse;