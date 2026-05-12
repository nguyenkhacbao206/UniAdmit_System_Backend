"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _base = _interopRequireDefault(require("./base"));
const UserPermissionGroup = (0, _base.default)('UserPermissionGroup', 'user_permission_groups', {
  code: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  position: {
    type: Number,
    required: true
  },
  parent_code: {
    type: String,
    default: null
  }
});
var _default = exports.default = UserPermissionGroup;