"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _base = _interopRequireWildcard(require("./base"));
var _bcrypt = _interopRequireDefault(require("bcrypt"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const User = (0, _base.default)('User', 'users', {
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    lowercase: true,
    required: function () {
      return !this.phone;
    }
  },
  phone: {
    type: String,
    required: function () {
      return !this.email;
    }
  },
  gender: {
    type: String,
    default: ''
  },
  dob: {
    type: Date,
    default: null
  },
  address: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    required: true,
    set(value) {
      const salt = _bcrypt.default.genSaltSync(10);
      return _bcrypt.default.hashSync(value, salt);
    }
  },
  status: {
    type: String,
    enum: Object.values(_base.STATUS_ACCOUNT),
    required: true,
    default: _base.STATUS_ACCOUNT.UNVERIFIED
  },
  isConfirmed: {
    type: Boolean,
    default: false
  },
  isSubmitted: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String,
    default: ''
  },
  otp_expired_at: {
    type: Date,
    default: null
  },
  deleted: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  toJSON: {
    virtuals: true,
    transform(doc, ret) {
      const {
        password,
        deleted,
        otp,
        otp_expired_at,
        ...result
      } = ret;
      return result;
    }
  },
  methods: {
    verifyPassword(password) {
      return _bcrypt.default.compareSync(password, this.password);
    }
  },
  virtuals: {
    permissions: {
      set(value) {
        this._permissions = value;
      },
      get() {
        return this._permissions;
      }
    }
  }
});
var _default = exports.default = User;