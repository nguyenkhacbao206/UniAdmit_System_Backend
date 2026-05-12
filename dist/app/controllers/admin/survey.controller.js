"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.approveQuestion = void 0;
var _survey = _interopRequireDefault(require("../../services/survey.service"));
const approveQuestion = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const question = await _survey.default.approveQuestion(id);
    res.json({
      success: true,
      message: 'Đã phê duyệt câu hỏi',
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