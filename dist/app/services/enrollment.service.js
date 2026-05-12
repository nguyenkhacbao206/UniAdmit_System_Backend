"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _user = _interopRequireDefault(require("../../models/user.js"));
var _profile = _interopRequireDefault(require("../../models/profile.js"));
var _preference = _interopRequireDefault(require("../../models/preference.js"));
var _invoice = _interopRequireDefault(require("../../models/invoice.js"));
var _score = _interopRequireDefault(require("../../models/score.js"));
var _enrollment = _interopRequireDefault(require("../../models/enrollment.js"));
class EnrollmentService {
  async createEnrollmentService(data) {
    return await _enrollment.default.create(data);
  }
  async getEnrollmentService() {
    return await _enrollment.default.find({}).sort({
      createdAt: -1
    });
  }
  async getEnrollmentByPages(page = 1, limit = 10) {
    const total = await _enrollment.default.countDocuments({});
    const data = await _enrollment.default.find({}).sort({
      createdAt: -1
    }).skip((page - 1) * limit).limit(limit);
    return {
      enrollment: data,
      total
    };
  }
  async getEnrollmentBySearch(data) {
    const q = data.q || '';
    return await _enrollment.default.find({
      $or: [{
        name: {
          $regex: q,
          $options: 'i'
        }
      }, {
        code: {
          $regex: q,
          $options: 'i'
        }
      }]
    });
  }
  async getEnrollmentByIdService(id) {
    return await _enrollment.default.findById(id);
  }
  async updateEnrollment(id, data) {
    return await _enrollment.default.findByIdAndUpdate(id, data, {
      new: true
    });
  }
  async deleteEnrollment(id) {
    return await _enrollment.default.findByIdAndDelete(id);
  }
  async getSummary(userId) {
    const user = await _user.default.findById(userId);
    const profile = await _profile.default.findOne({
      user_id: userId
    });
    const preferences = await _preference.default.find({
      userId
    }).populate('university major admissionMethod').sort({
      priority: 1
    });
    const score = await _score.default.findOne({
      user_id: userId
    });
    const invoice = await _invoice.default.findOne({
      userId
    }).sort({
      createdAt: -1
    });
    let bestCombination = null;
    if (score && score.combinations) {
      const COMBINATIONS_CONFIG = {
        'A00': ['math', 'physics', 'chemistry'],
        'A01': ['math', 'physics', 'english'],
        'B00': ['math', 'chemistry', 'biology'],
        'C00': ['literature', 'history', 'geography'],
        'D01': ['math', 'literature', 'english'],
        'D07': ['math', 'chemistry', 'english'],
        'C01': ['literature', 'math', 'physics'],
        'C02': ['literature', 'math', 'chemistry'],
        'C03': ['literature', 'math', 'history'],
        'D09': ['math', 'history', 'english'],
        'D10': ['math', 'geography', 'english']
      };
      const subjectNames = {
        math: 'Toán',
        physics: 'Lý',
        chemistry: 'Hóa',
        literature: 'Văn',
        english: 'Anh',
        biology: 'Sinh',
        history: 'Sử',
        geography: 'Địa',
        civic_education: 'GDCD'
      };
      let maxScore = -1;
      let bestBlock = '';
      for (const [block, value] of Object.entries(score.combinations)) {
        if (value > maxScore) {
          maxScore = value;
          bestBlock = block;
        }
      }
      if (bestBlock) {
        const subjects = COMBINATIONS_CONFIG[bestBlock] || [];
        const names = subjects.map(s => subjectNames[s]).join(', ');
        bestCombination = {
          block: bestBlock,
          score: maxScore,
          subjects: names
        };
      }
    }
    return {
      user,
      profile,
      preferences,
      score,
      invoice,
      bestCombination
    };
  }
  async submit(userId) {
    const user = await _user.default.findById(userId);
    if (user.isSubmitted) {
      throw new Error('Hồ sơ đã được nộp trước đó');
    }
    const profile = await _profile.default.findOne({
      user_id: userId
    });
    if (!profile || !profile.cccd) {
      throw new Error('Vui lòng hoàn thiện hồ sơ cá nhân');
    }
    if (!user.isConfirmed) {
      throw new Error('Vui lòng xác nhận danh sách nguyện vọng');
    }
    const invoice = await _invoice.default.findOne({
      userId,
      status: 'paid'
    });
    if (!invoice) {
      throw new Error('Vui lòng thanh toán lệ phí tuyển sinh');
    }
    const preferences = await _preference.default.find({
      userId
    });
    if (preferences.length === 0) {
      throw new Error('Chưa có nguyện vọng nào để nộp');
    }
    const now = new Date();
    const score = await _score.default.findOne({
      user_id: userId
    });
    let bestPoints = score?.average || 0;
    let bestCombName = '';
    if (score && score.combinations) {
      Object.entries(score.combinations).forEach(([comb, pts]) => {
        if (pts > bestPoints) {
          bestPoints = pts;
          bestCombName = comb;
        }
      });
    }
    for (const pref of preferences) {
      if (!pref.applicationCode) {
        const count = await _preference.default.countDocuments({
          applicationCode: {
            $exists: true
          }
        });
        pref.applicationCode = `APP${(count + 1).toString().padStart(3, '0')}`;
      }
      pref.status = 'pending';
      pref.submittedAt = now;
      pref.points = bestPoints;
      pref.combination = bestCombName;
      await pref.save();
    }
    user.isSubmitted = true;
    await user.save();
    return true;
  }
}
var _default = exports.default = new EnrollmentService();