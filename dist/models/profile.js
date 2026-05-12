"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _base = _interopRequireWildcard(require("./base"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const Profile = (0, _base.default)('Profile', 'profiles', {
  user_id: {
    type: _base.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    lowercase: true
  },
  phone: {
    type: String
  },
  ethnicity: {
    type: String,
    default: ''
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', ''],
    default: ''
  },
  dob: {
    type: Date,
    default: null
  },
  permanentAddress: {
    type: String,
    default: ''
  },
  contactAddress: {
    type: String,
    default: ''
  },
  cccd: {
    type: String,
    default: ''
  },
  place_of_issue: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  cv: {
    type: String,
    default: ''
  },
  school: {
    type: String,
    default: ''
  },
  score: {
    type: Number,
    default: 0
  },
  rank: {
    type: String,
    default: ''
  },
  cccd_doc: {
    type: String,
    default: ''
  },
  transcript_doc: {
    type: String,
    default: ''
  }
});
var _default = exports.default = Profile;