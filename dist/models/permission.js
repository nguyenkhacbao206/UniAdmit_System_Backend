"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _base = _interopRequireDefault(require("./base"));
const Permission = (0, _base.default)('Permission', 'permissions', {
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
}, {
  virtuals: {
    active: {
      set(value) {
        this._active = value;
      },
      get() {
        return this._active;
      }
    },
    disabled: {
      set(value) {
        this._disabled = value;
      },
      get() {
        return this._disabled;
      }
    }
  }
});
var _default = exports.default = Permission;