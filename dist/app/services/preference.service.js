"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var _preference = _interopRequireDefault(require("../../models/preference.js"));
var _user = _interopRequireDefault(require("../../models/user.js"));
var _score = _interopRequireDefault(require("../../models/score.js"));
var _major = _interopRequireDefault(require("../../models/major.js"));
class PreferenceService {
  async getByUser(userId) {
    return await _preference.default.find({
      userId
    }).sort({
      priority: 1
    }).populate('university major admissionMethod');
  }
  async addPreference(userId, data) {
    const user = await _user.default.findById(userId);
    if (user.isConfirmed) {
      throw new Error('Đã xác nhận, không thể thêm');
    }
    const exists = await _preference.default.findOne({
      userId,
      major: data.major,
      admissionMethod: data.admissionMethod
    });
    if (exists) {
      throw new Error('Nguyện vọng đã tồn tại');
    }
    const count = await _preference.default.countDocuments({
      userId
    });
    const preference = await _preference.default.create({
      ...data,
      userId,
      priority: count + 1
    });
    return preference;
  }
  async deletePreference(userId, id) {
    const user = await _user.default.findById(userId);
    if (user.isConfirmed) {
      throw new Error('Đã xác nhận, không thể xóa');
    }
    await _preference.default.deleteOne({
      _id: id,
      userId
    });
    const list = await _preference.default.find({
      userId
    }).sort({
      priority: 1
    });
    for (let i = 0; i < list.length; i++) {
      list[i].priority = i + 1;
      await list[i].save();
    }
    return true;
  }
  async reorder(userId, list) {
    const user = await _user.default.findById(userId);
    if (user.isConfirmed) {
      throw new Error('Đã xác nhận, không thể reorder');
    }
    const session = await _mongoose.default.startSession();
    session.startTransaction();
    try {
      for (const item of list) {
        await _preference.default.updateOne({
          _id: item.id,
          userId
        }, {
          priority: item.priority
        }, {
          session
        });
      }
      await session.commitTransaction();
      session.endSession();
      return true;
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }
  async confirm(userId) {
    const preferences = await _preference.default.find({
      userId
    });
    if (preferences.length === 0) {
      throw new Error('Chưa có nguyện vọng');
    }
    for (let i = 0; i < preferences.length; i++) {
      if (!preferences[i].applicationCode) {
        const count = await _preference.default.countDocuments({
          applicationCode: {
            $exists: true
          }
        });
        const nextCode = `APP${(count + 1).toString().padStart(3, '0')}`;
        preferences[i].applicationCode = nextCode;
        preferences[i].status = 'pending';
        await preferences[i].save();
      }
    }
    await _user.default.findByIdAndUpdate(userId, {
      isConfirmed: true
    });
    return true;
  }
  async unlock(userId) {
    await _user.default.findByIdAndUpdate(userId, {
      isConfirmed: false
    });
    return true;
  }
  async getResult(userId) {
    const user = await _user.default.findById(userId);
    if (!user.isConfirmed) {
      throw new Error('Chưa xác nhận');
    }
    const preferences = await _preference.default.find({
      userId
    }).populate('university major admissionMethod').sort({
      priority: 1
    });
    const score = await _score.default.findOne({
      userId
    });
    if (!score) {
      throw new Error('Chưa có điểm');
    }
    const totalScore = score.total;
    for (const pref of preferences) {
      const rule = await _major.default.findOne({
        majorId: pref.major?._id || pref.major,
        admissionMethodId: pref.admissionMethod?._id || pref.admissionMethod
      });
      if (!rule) continue;
      if (totalScore >= rule.scoreRequired) {
        return {
          passed: true,
          preference: pref
        };
      }
    }
    return {
      passed: false
    };
  }
}
var _default = exports.default = new PreferenceService();