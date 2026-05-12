"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.submitSurvey = exports.getResults = exports.getQuestions = void 0;
var _survey = _interopRequireDefault(require("../../services/survey.service"));
const getQuestions = async (req, res) => {
  try {
    const questions = await _survey.default.getPublishedQuestions();
    res.json({
      success: true,
      data: questions
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
exports.getQuestions = getQuestions;
const submitSurvey = async (req, res) => {
  try {
    const userId = req.currentUser._id;
    const {
      answers
    } = req.body;
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ'
      });
    }
    const result = await _survey.default.submitSurvey(userId, answers);
    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
exports.submitSurvey = submitSurvey;
const getResults = async (req, res) => {
  try {
    const userId = req.currentUser._id;
    const results = await _survey.default.getResultsHistory(userId);
    res.json({
      success: true,
      data: results
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
exports.getResults = getResults;