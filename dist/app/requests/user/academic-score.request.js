"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateSemesterScore = void 0;
var _joi = _interopRequireDefault(require("joi"));
const scoreSchema = _joi.default.number().min(0).max(10).default(0).label('Điểm số');
const updateSemesterScore = exports.updateSemesterScore = _joi.default.object({
  math: scoreSchema,
  literature: scoreSchema,
  english: scoreSchema,
  physics: scoreSchema,
  chemistry: scoreSchema,
  biology: scoreSchema,
  history: scoreSchema,
  geography: scoreSchema,
  civic_education: scoreSchema,
  conduct: _joi.default.string().allow('').label('Hạnh kiểm'),
  academic_rank: _joi.default.string().allow('').label('Học lực')
});