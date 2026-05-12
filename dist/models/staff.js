"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _base = _interopRequireDefault(require("./base"));
var _bcrypt = _interopRequireDefault(require("bcrypt"));
const Staff = (0, _base.default)('Staff', 'staffs', {
  code: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    required: true
  },
  mail: {
    type: String,
    required: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  deleted: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  methods: {
    verifyPassword(password) {
      if (this.password && this.password.startsWith('$2')) {
        return _bcrypt.default.compareSync(password, this.password);
      }
      return password === this.password;
    }
  }
});
var _default = exports.default = Staff;