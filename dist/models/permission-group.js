"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _base = _interopRequireDefault(require("./base"));
const PermissionGroup = (0, _base.default)('PermissionGroup', 'permission_groups', {
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
}, {
  virtuals: {
    types: {
      set(value) {
        this._types = value;
      },
      get() {
        return this._types;
      }
    },
    children: {
      set(value) {
        this._children = value;
      },
      get() {
        return this._children;
      }
    }
  }
});
var _default = exports.default = PermissionGroup;