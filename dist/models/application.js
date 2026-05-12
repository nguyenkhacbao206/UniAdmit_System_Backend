"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var _base = _interopRequireDefault(require("./base"));
const Application = (0, _base.default)('Application', 'applications', {
  user_id: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  round_id: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'Round',
    required: true,
    index: true
  },
  university_id: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'University',
    required: true
  },
  major_id: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'Major',
    required: true
  },
  aspiration_order: {
    type: Number,
    required: true
  },
  score: {
    type: Number,
    default: 0
  },
  method: {
    type: String,
    default: ''
  },
  combination: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'passed', 'failed'],
    default: 'pending'
  },
  verified_by: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'Staff',
    default: null
  },
  verified_at: {
    type: Date,
    default: null
  },
  rejection_reason: {
    type: String,
    default: ''
  },
  is_confirmed: {
    type: Boolean,
    default: false
  },
  confirmed_at: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  virtuals: {
    user: {
      ref: 'User',
      localField: 'user_id',
      foreignField: '_id',
      justOne: true
    },
    round: {
      ref: 'Round',
      localField: 'round_id',
      foreignField: '_id',
      justOne: true
    },
    university: {
      ref: 'University',
      localField: 'university_id',
      foreignField: '_id',
      justOne: true
    },
    major: {
      ref: 'Major',
      localField: 'major_id',
      foreignField: '_id',
      justOne: true
    }
  }
});
Application.schema.index({
  user_id: 1,
  round_id: 1,
  major_id: 1
}, {
  unique: true
});
Application.schema.index({
  round_id: 1,
  major_id: 1,
  status: 1
});
var _default = exports.default = Application;