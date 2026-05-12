"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var _base = _interopRequireDefault(require("./base"));
const supplementSchema = (0, _base.default)('Supplement', 'supplements', {
  userId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  staffId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'Staff'
  },
  preferenceId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'Preference',
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  deadline: {
    type: Date
  },
  userFeedback: {
    type: String,
    default: ''
  },
  attachments: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['pending', 'submitted', 'approved', 'rejected'],
    default: 'pending'
  },
  resubmittedAt: {
    type: Date
  }
}, {
  timestamps: true
});
var _default = exports.default = supplementSchema;