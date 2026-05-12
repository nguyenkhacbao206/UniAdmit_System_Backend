"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _preference = _interopRequireDefault(require("../../../models/preference.js"));
var _user = _interopRequireDefault(require("../../../models/user.js"));
var _score = _interopRequireDefault(require("../../../models/score.js"));
var _profile = _interopRequireDefault(require("../../../models/profile.js"));
var _admissionMethod = _interopRequireDefault(require("../../../models/admission-method.js"));
var _notificationService = _interopRequireDefault(require("../notification.service.js"));
var _supplementService = _interopRequireDefault(require("./supplement.service.js"));
var _index = require("../../../models/index.js");
class ApplicationService {
  async getList(query = {}) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      admissionMethod
    } = query;
    const userFilter = {
      isSubmitted: true
    };
    if (search) {
      userFilter.$or = [{
        name: {
          $regex: search,
          $options: 'i'
        }
      }, {
        email: {
          $regex: search,
          $options: 'i'
        }
      }];
    }
    const users = await _user.default.find(userFilter).sort({
      name: 1
    });
    const allRows = [];
    for (const user of users) {
      const prefFilter = {
        userId: user._id
      };
      if (status) prefFilter.status = status;
      if (admissionMethod && admissionMethod !== 'Tất cả phương thức') {
        const am = await _admissionMethod.default.findOne({
          $or: [{
            code: admissionMethod
          }, {
            methodName: admissionMethod
          }]
        });
        if (am) {
          prefFilter.admissionMethod = am._id;
        } else {
          continue;
        }
      }
      const preferences = await _preference.default.find(prefFilter).populate('university major admissionMethod').sort({
        priority: 1
      });
      const profile = await _profile.default.findOne({
        user_id: user._id
      });
      const score = await _score.default.findOne({
        user_id: user._id
      });
      let bestPoints = 0;
      let bestCombName = '';
      if (score && score.combinations && Object.keys(score.combinations).length > 0) {
        Object.entries(score.combinations).forEach(([comb, pts]) => {
          if (Number(pts) > bestPoints) {
            bestPoints = Number(pts);
            bestCombName = comb;
          }
        });
      } else {
        bestPoints = score?.average || 0;
      }
      for (const pref of preferences) {
        const finalPoints = pref.points || bestPoints;
        const finalComb = pref.combination || bestCombName;
        const supplements = await _index.Supplement.find({
          preferenceId: pref._id
        }).sort({
          createdAt: -1
        });
        allRows.push({
          ...pref.toObject(),
          points: finalPoints,
          combination: finalComb,
          supplements,
          student: {
            ...user.toObject(),
            profile: profile?.toObject(),
            score: score?.toObject()
          },
          submittedAt: pref.submittedAt || pref.createdAt
        });
      }
    }
    const total = allRows.length;
    const paginatedList = allRows.slice((page - 1) * limit, page * limit);
    return {
      data: paginatedList,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit)
      }
    };
  }
  async updateStatus(id, status, message, staffId) {
    const preference = await _preference.default.findByIdAndUpdate(id, {
      status
    }, {
      new: true
    }).populate('university major');
    if (!preference) throw new Error('Không tìm thấy hồ sơ');
    const userId = preference.userId;
    const majorName = preference.major?.name || 'Ngành đã đăng ký';
    const uniName = preference.university?.name || 'Trường đã đăng ký';
    if (status === 'additional_required') {
      await _supplementService.default.createRequest({
        userId,
        preferenceId: preference._id,
        type: 'Bổ sung thông tin hồ sơ',
        content: message || 'Vui lòng bổ sung thông tin theo yêu cầu của nhà trường.',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }, staffId);
      return preference;
    }
    const notifMap = {
      approved: {
        title: '✅ Hồ sơ đã được duyệt',
        description: `Chúc mừng! Hồ sơ ngành ${majorName} - ${uniName} của bạn đã được duyệt thành công.`,
        type: 'approved'
      },
      rejected: {
        title: '❌ Hồ sơ bị từ chối',
        description: message ? `Hồ sơ ngành ${majorName} - ${uniName} bị từ chối. Lý do: ${message}` : `Hồ sơ ngành ${majorName} - ${uniName} của bạn đã bị từ chối.`,
        type: 'rejected'
      }
    };
    const notifPayload = notifMap[status];
    if (notifPayload && userId) {
      try {
        await _notificationService.default.createAndPush(userId, {
          ...notifPayload,
          metadata: {
            preferenceId: preference._id,
            applicationCode: preference.applicationCode,
            majorName,
            universityName: uniName,
            status
          }
        });
      } catch (notifErr) {
        console.error('Notification send error:', notifErr.message);
      }
    }
    return preference;
  }
}
var _default = exports.default = new ApplicationService();