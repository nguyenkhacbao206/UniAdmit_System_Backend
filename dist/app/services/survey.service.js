"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _surveyQuestion = _interopRequireDefault(require("../../models/surveyQuestion"));
var _surveyOption = _interopRequireDefault(require("../../models/surveyOption"));
var _userSurveyResult = _interopRequireDefault(require("../../models/userSurveyResult"));
var _major = _interopRequireDefault(require("../../models/major"));
class SurveyService {
  async createQuestion(data, staffId) {
    return await _surveyQuestion.default.create({
      ...data,
      createdBy: staffId,
      status: 'pending'
    });
  }
  async updateQuestion(id, data) {
    return await _surveyQuestion.default.findByIdAndUpdate(id, data, {
      new: true
    });
  }
  async deleteQuestion(id) {
    await _surveyOption.default.deleteMany({
      questionId: id
    });
    return await _surveyQuestion.default.findByIdAndDelete(id);
  }
  async addOptionToQuestion(questionId, optionData) {
    return await _surveyOption.default.create({
      ...optionData,
      questionId
    });
  }
  async updateOption(optionId, data) {
    return await _surveyOption.default.findByIdAndUpdate(optionId, data, {
      new: true
    });
  }
  async getAllQuestions() {
    return await _surveyQuestion.default.find().populate('options').sort({
      order: 1
    });
  }
  async approveQuestion(id) {
    return await _surveyQuestion.default.findByIdAndUpdate(id, {
      status: 'published'
    }, {
      new: true
    });
  }
  async getPublishedQuestions() {
    return await _surveyQuestion.default.find({
      status: 'published'
    }).populate('options').sort({
      order: 1
    });
  }
  async submitSurvey(userId, answers) {
    const majorScoresMap = {};
    for (const ans of answers) {
      const option = await _surveyOption.default.findById(ans.optionId);
      if (option) {
        for (const mapping of option.scores) {
          const mid = mapping.majorId.toString();
          majorScoresMap[mid] = (majorScoresMap[mid] || 0) + mapping.score;
        }
      }
    }
    const majorScoresArray = Object.entries(majorScoresMap).map(([majorId, totalScore]) => ({
      majorId,
      totalScore
    })).sort((a, b) => b.totalScore - a.totalScore);
    if (majorScoresArray.length === 0) {
      throw new Error('Không thể xác định kết quả. Vui lòng thử lại.');
    }
    const bestMatch = majorScoresArray[0];
    const matchPercentage = Math.min(100, bestMatch.totalScore / (answers.length * 3) * 100);
    const result = await _userSurveyResult.default.create({
      userId,
      majorScores: majorScoresArray,
      suggestedMajorId: bestMatch.majorId,
      matchPercentage: Math.round(matchPercentage),
      answers
    });
    return await _userSurveyResult.default.findById(result._id).populate('suggestedMajor');
  }
  async getResultsHistory(userId) {
    return await _userSurveyResult.default.find({
      userId
    }).populate('suggestedMajor').sort({
      createdAt: -1
    });
  }
  async getStats() {
    const totalUser = await _userSurveyResult.default.countDocuments();
    const suggestedStats = await _userSurveyResult.default.aggregate([{
      $group: {
        _id: '$suggestedMajorId',
        count: {
          $sum: 1
        }
      }
    }, {
      $sort: {
        count: -1
      }
    }, {
      $limit: 10
    }]);
    return {
      totalUser,
      topSuggested: suggestedStats
    };
  }
}
var _default = exports.default = new SurveyService();