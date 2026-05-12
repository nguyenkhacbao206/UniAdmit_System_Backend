"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateQuestion = exports.getStats = exports.getQuestions = exports.deleteQuestion = exports.createQuestion = exports.approveQuestion = exports.addOption = void 0;
var _survey = _interopRequireDefault(require("../../services/survey.service"));
const getQuestions = async (req, res) => {
  try {
    const questions = await _survey.default.getAllQuestions();
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
const createQuestion = async (req, res) => {
  try {
    const staffId = req.currentStaff?._id || req.currentAdmin?._id || req.currentUser?._id;
    if (!staffId) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập với quyền Staff/Admin'
      });
    }
    const question = await _survey.default.createQuestion(req.body, staffId);
    res.status(201).json({
      success: true,
      data: question
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
exports.createQuestion = createQuestion;
const addOption = async (req, res) => {
  try {
    const {
      questionId
    } = req.params;
    const option = await _survey.default.addOptionToQuestion(questionId, req.body);
    res.status(201).json({
      success: true,
      data: option
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
exports.addOption = addOption;
const updateQuestion = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const question = await _survey.default.updateQuestion(id, req.body);
    res.json({
      success: true,
      data: question
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
exports.updateQuestion = updateQuestion;
const deleteQuestion = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    await _survey.default.deleteQuestion(id);
    res.json({
      success: true,
      message: 'Đã xóa câu hỏi'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
exports.deleteQuestion = deleteQuestion;
const getStats = async (req, res) => {
  try {
    const stats = await _survey.default.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
exports.getStats = getStats;
const approveQuestion = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const question = await _survey.default.approveQuestion(id);
    res.json({
      success: true,
      message: 'Đã phê duyệt câu hỏi (Test mode: Staff)',
      data: question
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
exports.approveQuestion = approveQuestion;