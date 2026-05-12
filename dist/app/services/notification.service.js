"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _notification = _interopRequireDefault(require("../../models/notification.js"));
var _sse = require("../../utils/sse.js");
class NotificationService {
  async getNotifications(userId, {
    page = 1,
    limit = 20
  } = {}) {
    const query = {
      userId
    };
    const total = await _notification.default.countDocuments(query);
    const unread = await _notification.default.countDocuments({
      ...query,
      read: false
    });
    const result = await _notification.default.find(query).sort({
      createdAt: -1
    }).skip((page - 1) * limit).limit(limit);
    return {
      result,
      total,
      unread
    };
  }
  async markRead(userId, notificationId) {
    return await _notification.default.findOneAndUpdate({
      _id: notificationId,
      userId
    }, {
      read: true
    }, {
      new: true
    });
  }
  async markAllRead(userId) {
    return await _notification.default.updateMany({
      userId,
      read: false
    }, {
      read: true
    });
  }
  async createAndPush(userId, {
    title,
    description,
    type,
    metadata
  }) {
    const notification = await _notification.default.create({
      userId,
      title,
      description: description || '',
      type: type || 'system',
      metadata: metadata || {},
      read: false
    });
    (0, _sse.sendToUser)(userId, {
      event: 'new_notification',
      notification: {
        _id: notification._id,
        title: notification.title,
        description: notification.description,
        type: notification.type,
        read: notification.read,
        createdAt: notification.createdAt,
        metadata: notification.metadata
      }
    });
    return notification;
  }
}
var _default = exports.default = new NotificationService();