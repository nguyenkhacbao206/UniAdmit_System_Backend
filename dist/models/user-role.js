"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _base = _interopRequireWildcard(require("./base"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const UserRole = (0, _base.default)('UserRole', 'user_roles', {
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    default: null
  },
  description: {
    type: String,
    default: ''
  },
  can_delete: {
    type: Boolean,
    required: true,
    default: true
  },
  permission_ids: {
    type: [_base.ObjectId],
    required: true,
    default: []
  }
});
var _default = exports.default = UserRole;