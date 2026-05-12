"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _application = _interopRequireDefault(require("../../../models/application.js"));
var _user = _interopRequireDefault(require("../../../models/user.js"));
var _profile = _interopRequireDefault(require("../../../models/profile.js"));
var _score = _interopRequireDefault(require("../../../models/score.js"));
var _notificationService = _interopRequireDefault(require("../notification.service.js"));
class StaffAdmissionService {
  async getList(query = {}) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      round_id,
      major_id,
      university_id
    } = query;
    const filter = {};
    if (round_id) filter.round_id = round_id;
    if (major_id) filter.major_id = major_id;
    if (university_id) filter.university_id = university_id;
    if (status) filter.status = status;
    if (search) {
      const users = await _user.default.find({
        $or: [{
          name: {
            $regex: search,
            $options: 'i'
          }
        }, {
          email: {
            $regex: search,
            $options: 'i'
          }
        }]
      }).select('_id');
      filter.user_id = {
        $in: users.map(u => u._id)
      };
    }
    const total = await _application.default.countDocuments(filter);
    const applications = await _application.default.find(filter).populate('university_id major_id round_id verified_by').sort({
      createdAt: -1
    }).skip((page - 1) * limit).limit(Number(limit));
    const data = [];
    for (const app of applications) {
      const user = await _user.default.findById(app.user_id).select('-password -otp -otp_expired_at');
      const profile = await _profile.default.findOne({
        user_id: app.user_id
      });
      const score = await _score.default.findOne({
        user_id: app.user_id
      });
      data.push({
        ...app.toObject(),
        student: {
          ...user?.toObject(),
          profile: profile?.toObject(),
          score: score?.toObject()
        }
      });
    }
    return {
      data,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit)
      }
    };
  }
  async verifyApplication(id, staffId) {
    const application = await _application.default.findById(id).populate('major_id university_id');
    if (!application) throw new Error('Không tìm thấy hồ sơ');
    if (application.status !== 'pending') {
      throw new Error('Chỉ có thể xác minh hồ sơ ở trạng thái chờ duyệt');
    }
    application.status = 'verified';
    application.verified_by = staffId;
    application.verified_at = new Date();
    await application.save();
    const majorName = application.major_id?.name || 'Ngành đã đăng ký';
    const uniName = application.university_id?.name || 'Trường đã đăng ký';
    await _notificationService.default.createAndPush(application.user_id, {
      title: 'Hồ sơ đã được xác minh',
      description: `Hồ sơ ngành ${majorName} - ${uniName} của bạn đã được xác minh thành công.`,
      type: 'approved',
      metadata: {
        applicationId: application._id,
        majorName,
        universityName: uniName,
        status: 'verified'
      }
    }).catch(err => console.error('Notification error:', err.message));
    return application;
  }
  async rejectApplication(id, staffId, reason) {
    const application = await _application.default.findById(id).populate('major_id university_id');
    if (!application) throw new Error('Không tìm thấy hồ sơ');
    if (application.status !== 'pending') {
      throw new Error('Chỉ có thể từ chối hồ sơ ở trạng thái chờ duyệt');
    }
    application.status = 'rejected';
    application.rejection_reason = reason || '';
    application.verified_by = staffId;
    application.verified_at = new Date();
    await application.save();
    const majorName = application.major_id?.name || 'Ngành đã đăng ký';
    const uniName = application.university_id?.name || 'Trường đã đăng ký';
    await _notificationService.default.createAndPush(application.user_id, {
      title: 'Hồ sơ bị từ chối',
      description: reason ? `Hồ sơ ngành ${majorName} - ${uniName} bị từ chối. Lý do: ${reason}` : `Hồ sơ ngành ${majorName} - ${uniName} của bạn đã bị từ chối.`,
      type: 'rejected',
      metadata: {
        applicationId: application._id,
        majorName,
        universityName: uniName,
        status: 'rejected',
        reason
      }
    }).catch(err => console.error('Notification error:', err.message));
    return application;
  }
}
var _default = exports.default = new StaffAdmissionService();