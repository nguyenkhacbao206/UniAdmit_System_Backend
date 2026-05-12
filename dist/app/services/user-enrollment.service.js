"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _user = _interopRequireDefault(require("../../models/user.js"));
var _profile = _interopRequireDefault(require("../../models/profile.js"));
var _preference = _interopRequireDefault(require("../../models/preference.js"));
var _score = _interopRequireDefault(require("../../models/score.js"));
var _invoice = _interopRequireDefault(require("../../models/invoice.js"));
class UserEnrollmentService {
  async getSummary(userId) {
    const user = await _user.default.findById(userId);
    if (!user) throw new Error('Người dùng không tồn tại');
    const profile = await _profile.default.findOne({
      user_id: userId
    });
    const preferences = await _preference.default.find({
      userId
    }).populate('university').populate('major').populate('admissionMethod').sort({
      priority: 1
    });
    const score = await _score.default.findOne({
      user_id: userId
    });
    const invoice = await _invoice.default.findOne({
      userId,
      status: 'paid'
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
      user: {
        name: user.name,
        email: user.email,
        isConfirmed: user.isConfirmed,
        isSubmitted: user.isSubmitted
      },
      profile,
      preferences,
      score,
      bestCombination,
      invoice
    };
  }
  async submitApplication(userId) {
    const user = await _user.default.findById(userId);
    if (!user) throw new Error('Người dùng không tồn tại');
    if (user.isSubmitted) {
      throw new Error('Hồ sơ đã được nộp trước đó.');
    }
    const profile = await _profile.default.findOne({
      user_id: userId
    });
    if (!profile || !profile.cccd) {
      throw new Error('Vui lòng hoàn thiện hồ sơ cá nhân.');
    }
    const preferences = await _preference.default.find({
      userId
    });
    if (preferences.length === 0) {
      throw new Error('Vui lòng đăng ký nguyện vọng.');
    }
    if (!user.isConfirmed) {
      throw new Error('Bạn chưa xác nhận nguyện vọng đăng ký.');
    }
    const invoice = await _invoice.default.findOne({
      userId,
      status: 'paid'
    });
    if (!invoice) {
      throw new Error('Bạn chưa hoàn tất thanh toán lệ phí.');
    }
    user.isSubmitted = true;
    await user.save();
    return user;
  }
}
var _default = exports.default = new UserEnrollmentService();