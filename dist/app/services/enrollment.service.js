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
var _application = _interopRequireDefault(require("../../models/application.js"));
var _round = _interopRequireDefault(require("../../models/round.js"));
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
  async getSummary(userId, roundId) {
    const user = await _user.default.findById(userId);
    const profile = await _profile.default.findOne({
      user_id: userId
    });
    const score = await _score.default.findOne({
      user_id: userId
    });
    let round = null;
    let applications = [];
    let invoice = null;
    if (roundId) {
      round = await _round.default.findById(roundId);
      applications = await _application.default.find({
        user_id: userId,
        round_id: roundId
      }).populate('university_id major_id').sort({
        aspiration_order: 1
      });
      invoice = await _invoice.default.findOne({
        userId,
        round_id: roundId
      }).sort({
        createdAt: -1
      });
    }
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
      applications,
      round,
      score,
      invoice,
      bestCombination
    };
  }
  async submit(userId, roundId) {
    if (!roundId) throw new Error('Vui lòng chọn đợt xét tuyển');
    const round = await _round.default.findById(roundId);
    if (!round) throw new Error('Không tìm thấy đợt xét tuyển');
    const profile = await _profile.default.findOne({
      user_id: userId
    });
    if (!profile || !profile.cccd) {
      throw new Error('Vui lòng hoàn thiện hồ sơ cá nhân');
    }
    const applications = await _application.default.find({
      user_id: userId,
      round_id: roundId
    });
    if (applications.length === 0) {
      throw new Error('Chưa có nguyện vọng nào trong đợt này');
    }
    const invoice = await _invoice.default.findOne({
      userId,
      round_id: roundId,
      status: 'paid'
    });
    if (!invoice) {
      throw new Error('Vui lòng thanh toán lệ phí cho đợt này');
    }
    if (invoice.isSubmitted) {
      throw new Error('Hồ sơ đợt này đã được nộp trước đó');
    }
    invoice.isSubmitted = true;
    invoice.submittedAt = new Date();
    await invoice.save();
    return true;
  }
}
var _default = exports.default = new EnrollmentService();