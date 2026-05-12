"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _base = _interopRequireWildcard(require("./base"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const Major = (0, _base.default)('Major', 'majors', {
  code: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  major: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  university_id: {
    type: _base.ObjectId,
    required: true
  },
  quota: {
    type: Number,
    required: true
  },
  minimum_score: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    default: ''
  },
  duration: {
    type: String,
    enum: ['4 năm', '5 năm', '6 năm', '7 năm', '8 năm'],
    default: '4 năm'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    required: true,
    default: 'active'
  },
  groups: [{
    type: String
  }],
  careers: [{
    type: String
  }],
  curriculum: [{
    type: String
  }],
  benchmarks: [{
    year: Number,
    value: Number,
    quota: Number
  }],
  employment_rate: {
    type: String,
    default: '0%'
  },
  suitability_reason: {
    type: String,
    default: ''
  },
  advantages: [{
    type: String
  }],
  disadvantages: [{
    type: String
  }],
  tuition: {
    type: String,
    default: 'Đang cập nhật'
  },
  career_opportunities: [{
    type: String
  }],
  career_trends: {
    type: String,
    default: ''
  },
  is_suggestion_published: {
    type: Boolean,
    default: false
  }
}, {
  toJSON: {
    virtuals: true,
    transform(doc, ret) {
      const {
        deleted,
        ...result
      } = ret;
      return result;
    }
  },
  virtuals: {
    university: {
      ref: 'University',
      localField: 'university_id',
      foreignField: '_id',
      justOne: true
    }
  }
}, {
  timestamp: true
});
var _default = exports.default = Major;