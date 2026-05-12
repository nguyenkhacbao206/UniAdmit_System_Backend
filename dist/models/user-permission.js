"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _base = _interopRequireDefault(require("./base"));
const UserPermission = (0, _base.default)('UserPermission', 'user-permissions', {
  code: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  permission_group_code: {
    type: String,
    default: null
  },
  permission_type_code: {
    type: String,
    default: null
  }
});
var _default = exports.default = UserPermission;