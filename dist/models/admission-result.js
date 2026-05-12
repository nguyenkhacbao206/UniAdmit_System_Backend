"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var _base = _interopRequireDefault(require("./base"));
const AdmissionResult = (0, _base.default)('AdmissionResult', 'admission_results', {
  round_id: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'Round',
    required: true,
    index: true
  },
  major_id: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'Major',
    required: true
  },
  university_id: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'University',
    required: true
  },
  total_applications: {
    type: Number,
    default: 0
  },
  total_passed: {
    type: Number,
    default: 0
  },
  cutoff_score: {
    type: Number,
    default: 0
  },
  quota: {
    type: Number,
    default: 0
  },
  minimum_score: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  published_at: {
    type: Date,
    default: null
  },
  published_by: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  }
}, {
  timestamps: true,
  virtuals: {
    major: {
      ref: 'Major',
      localField: 'major_id',
      foreignField: '_id',
      justOne: true
    },
    university: {
      ref: 'University',
      localField: 'university_id',
      foreignField: '_id',
      justOne: true
    },
    round: {
      ref: 'Round',
      localField: 'round_id',
      foreignField: '_id',
      justOne: true
    }
  }
});
AdmissionResult.schema.index({
  round_id: 1,
  major_id: 1
}, {
  unique: true
});
var _default = exports.default = AdmissionResult;