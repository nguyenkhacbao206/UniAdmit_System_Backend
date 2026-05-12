"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _base = _interopRequireDefault(require("./base"));
const University = (0, _base.default)('University', 'universities', {
  code: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  location: {
    type: String
  },
  majors: {
    type: Number
  },
  status: {
    type: String,
    default: 'active'
  }
}, {
  timestamps: true
});
var _default = exports.default = University;