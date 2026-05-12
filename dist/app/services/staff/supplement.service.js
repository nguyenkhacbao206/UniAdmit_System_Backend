"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _index = require("../../../models/index.js");
var _notificationService = _interopRequireDefault(require("../notification.service.js"));
class SupplementService {
  async getList(query = {}) {
    const {
      page = 1,
      limit = 10,
      status,
      type
    } = query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    const total = await _index.Supplement.countDocuments(filter);
    const result = await _index.Supplement.find(filter).populate('userId', 'name email phone').populate({
      path: 'preferenceId',
      populate: {
        path: 'university major'
      }
    }).sort({
      createdAt: -1
    }).skip((page - 1) * limit).limit(Number(limit));
    return {
      result,
      total
    };
  }
  async createRequest(data, staffId) {
    const {
      userId,
      preferenceId,
      type,
      content,
      deadline
    } = data;
    const code = `SUP${Date.now().toString().slice(-6)}`;
    const supplement = await _index.Supplement.create({
      userId,
      staffId,
      preferenceId,
      code,
      type,
      content,
      deadline,
      status: 'pending'
    });
    await _index.Preference.findByIdAndUpdate(preferenceId, {
      status: 'additional_required'
    });
    await _notificationService.default.createAndPush(userId, {
      title: '📋 Yêu cầu bổ sung hồ sơ',
      description: `Yêu cầu bổ sung: ${type}. Nội dung: ${content}`,
      type: 'additional_required',
      metadata: {
        supplementId: supplement._id,
        preferenceId
      }
    });
    return supplement;
  }
  async handleAction(id, action, message) {
    const supplement = await _index.Supplement.findById(id);
    if (!supplement) throw new Error('Không tìm thấy yêu cầu bổ sung');
    if (action === 'approve') {
      supplement.status = 'approved';
    } else if (action === 'reject') {
      supplement.status = 'rejected';
    }
    await supplement.save();
    const title = action === 'approve' ? '✅ Bổ sung hồ sơ được chấp nhận' : '❌ Bổ sung hồ sơ bị từ chối';
    const description = action === 'approve' ? `Yêu cầu ${supplement.code} đã được phê duyệt.` : `Yêu cầu ${supplement.code} bị từ chối. Lý do: ${message}`;
    await _notificationService.default.createAndPush(supplement.userId, {
      title,
      description,
      type: action === 'approve' ? 'approved' : 'rejected',
      metadata: {
        supplementId: supplement._id
      }
    });
    return supplement;
  }
  async getUserRequests(userId) {
    return await _index.Supplement.find({
      userId
    }).populate({
      path: 'preferenceId',
      populate: {
        path: 'university major'
      }
    }).sort({
      createdAt: -1
    });
  }
  async submitResponse(id, userId, data) {
    const {
      userFeedback,
      attachments
    } = data;
    const supplement = await _index.Supplement.findOne({
      _id: id,
      userId
    });
    if (!supplement) throw new Error('Không tìm thấy yêu cầu bổ sung');
    if (supplement.status === 'approved') throw new Error('Yêu cầu đã được phê duyệt, không thể chỉnh sửa');
    supplement.userFeedback = userFeedback;
    supplement.attachments = attachments || [];
    supplement.status = 'submitted';
    supplement.resubmittedAt = new Date();
    await supplement.save();
    if (supplement.staffId) {
      const user = await _index.User.findById(userId);
      await _notificationService.default.createAndPush(supplement.staffId, {
        title: '📩 Có phản hồi bổ sung mới',
        description: `Thí sinh ${user?.name || 'User'} đã nộp lại minh chứng cho yêu cầu ${supplement.code}`,
        type: 'submitted',
        metadata: {
          supplementId: supplement._id
        }
      });
    }
    return supplement;
  }
}
var _default = exports.default = new SupplementService();