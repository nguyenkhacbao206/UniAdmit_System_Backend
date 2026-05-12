"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sseStream = exports.markRead = exports.markAllRead = exports.getNotifications = void 0;
var _notificationService = _interopRequireDefault(require("../../services/notification.service.js"));
var _sse = require("../../../utils/sse.js");
var _authService = require("../../services/auth.service.js");
var _index = require("../../../configs/index.js");
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _index2 = require("../../../models/index.js");
const getNotifications = async (req, res) => {
  try {
    const userId = req.currentUser?._id || req.currentStaff?._id || req.currentAdmin?._id;
    const {
      page = 1,
      limit = 20
    } = req.query;
    const data = await _notificationService.default.getNotifications(userId, {
      page: Number(page),
      limit: Number(limit)
    });
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
exports.getNotifications = getNotifications;
const markRead = async (req, res) => {
  try {
    const userId = req.currentUser?._id || req.currentStaff?._id || req.currentAdmin?._id;
    const {
      id
    } = req.params;
    const data = await _notificationService.default.markRead(userId, id);
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
exports.markRead = markRead;
const markAllRead = async (req, res) => {
  try {
    const userId = req.currentUser?._id || req.currentStaff?._id || req.currentAdmin?._id;
    await _notificationService.default.markAllRead(userId);
    res.json({
      success: true,
      message: 'Đã đánh dấu tất cả là đã đọc'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
exports.markAllRead = markAllRead;
const sseStream = async (req, res) => {
  let userId;
  const queryToken = req.query.token;
  if (queryToken) {
    try {
      const isAllowed = !(await _authService.tokenBlocklist.get(queryToken));
      if (!isAllowed) {
        return res.status(401).json({
          success: false,
          message: 'Token không hợp lệ.'
        });
      }
      const payload = _jsonwebtoken.default.verify(queryToken, _index.SECRET_KEY);
      if (payload.type === _index.TOKEN_TYPE.USER_AUTHORIZATION) {
        const user = await _index2.User.findOne({
          _id: payload.data.userId,
          deleted: false
        });
        if (user) userId = user._id;
      } else if (payload.type === _index.TOKEN_TYPE.STAFF_AUTHORIZATION) {
        const staff = await _index2.Staff.findOne({
          _id: payload.data.staffId,
          deleted: false
        });
        if (staff) userId = staff._id;
      } else if (payload.type === _index.TOKEN_TYPE.ADMIN_AUTHORIZATION) {
        const admin = await _index2.Admin.findOne({
          _id: payload.data.adminId,
          deleted: false
        });
        if (admin) userId = admin._id;
      }
    } catch (e) {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn.'
      });
    }
  } else {
    userId = req.currentUser?._id || req.currentStaff?._id || req.currentAdmin?._id;
  }
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Yêu cầu đăng nhập.'
    });
  }
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders();
  res.write(`data: ${JSON.stringify({
    event: 'connected',
    userId: String(userId)
  })}\n\n`);
  (0, _sse.addClient)(userId, res);
  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n');
  }, 25000);
  req.on('close', () => {
    clearInterval(heartbeat);
    (0, _sse.removeClient)(userId);
  });
};
exports.sseStream = sseStream;