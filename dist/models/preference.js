"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var _base = _interopRequireDefault(require("./base"));
const preferenceSchema = (0, _base.default)('Preference', 'preferences', {
  userId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  university: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'University',
    required: true
  },
  major: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'Major',
    required: true
  },
  admissionMethod: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'AdmissionMethod'
  },
  priority: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'approved', 'rejected', 'additional_required'],
    default: 'pending'
  },
  applicationCode: {
    type: String,
    unique: true,
    sparse: true
  },
  submittedAt: {
    type: Date,
    default: null
  },
  points: {
    type: Number,
    default: 0
  },
  combination: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});
var _default = exports.default = preferenceSchema;