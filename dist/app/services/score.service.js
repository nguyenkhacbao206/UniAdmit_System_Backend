"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getScoreByUserId = getScoreByUserId;
exports.updateOrCreateScore = updateOrCreateScore;
exports.verifyScore = verifyScore;
var _models = require("../../models");
var _helpers = require("../../utils/helpers");
var _lodash = _interopRequireDefault(require("lodash"));
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
function calculateCombinations(scores) {
  const results = {};
  for (const [block, subjects] of Object.entries(COMBINATIONS_CONFIG)) {
    const total = subjects.reduce((sum, sub) => sum + (scores[sub] || 0), 0);
    results[block] = Number(total.toFixed(2));
  }
  return results;
}
async function getScoreByUserId(userId) {
  const score = await _models.Score.findOne({
    user_id: userId
  });
  if (!score) {
    (0, _helpers.abort)(404, 'Chưa có dữ liệu điểm thi.');
  }
  return score;
}
async function updateOrCreateScore(userId, scoreData) {
  const subjectFields = ['math', 'literature', 'english', 'physics', 'chemistry', 'biology', 'history', 'geography', 'civic_education'];
  const scores = _lodash.default.pick(scoreData, subjectFields);
  subjectFields.forEach(field => {
    if (!scores[field]) scores[field] = 0;
  });
  const values = Object.values(scores);
  const average = values.length > 0 ? _lodash.default.sum(values) / values.length : 0;
  const combinations = calculateCombinations(scores);
  const updatedScore = await _models.Score.findOneAndUpdate({
    user_id: userId
  }, {
    ...scores,
    combinations,
    average: Number(average.toFixed(2)),
    verified: false
  }, {
    new: true,
    upsert: true
  });
  return updatedScore;
}
async function verifyScore(userId, status) {
  const score = await _models.Score.findOneAndUpdate({
    user_id: userId
  }, {
    verified: status
  }, {
    new: true
  });
  if (!score) (0, _helpers.abort)(404, 'Không tìm thấy bảng điểm để xác thực.');
  return score;
}