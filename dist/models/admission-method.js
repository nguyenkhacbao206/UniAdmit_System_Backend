"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _base = _interopRequireDefault(require("./base"));
const AdmissionMethod = (0, _base.default)('AdmissionMethod', 'admissionMethods', {
  code: {
    type: String,
    required: true
  },
  methodName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
});
var _default = exports.default = AdmissionMethod;