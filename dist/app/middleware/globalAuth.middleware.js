"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.globalAuth = globalAuth;
var _helpers = require("../../utils/helpers");
var _lodash = _interopRequireDefault(require("lodash"));
var _auth = require("../services/auth.service");
var _configs = require("../../configs");
var _jsonwebtoken = _interopRequireWildcard(require("jsonwebtoken"));
var _models = require("../../models");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
async function globalAuth(req, res, next) {
  try {
    const token = (0, _helpers.getToken)(req.headers);
    if (!token) return (0, _helpers.abort)(401, 'Vui lòng đăng nhập để tiếp tục.');
    const isAllowed = _lodash.default.isUndefined(await _auth.tokenBlocklist.get(token));
    if (!isAllowed) {
      return (0, _helpers.abort)(401, 'Phiên đăng nhập không hợp lệ hoặc đã bị đăng xuất.');
    }
    const payload = _jsonwebtoken.default.verify(token, _configs.SECRET_KEY);
    const {
      type,
      data
    } = payload;
    if (type === _configs.TOKEN_TYPE.ADMIN_AUTHORIZATION) {
      const admin = await _models.Admin.findOne({
        _id: data.adminId,
        deleted: false
      });
      if (admin) {
        req.currentAdmin = admin;
        req.userType = 'admin';
        return next();
      }
    } else if (type === _configs.TOKEN_TYPE.STAFF_AUTHORIZATION) {
      const staff = await _models.Staff.findOne({
        _id: data.staffId,
        deleted: false
      });
      if (staff) {
        req.currentStaff = staff;
        req.userType = 'staff';
        return next();
      }
    } else if (type === _configs.TOKEN_TYPE.USER_AUTHORIZATION) {
      const user = await _models.User.findOne({
        _id: data.userId,
        deleted: false
      });
      if (user) {
        req.currentUser = user;
        req.userType = 'user';
        return next();
      }
    }
  } catch (error) {
    if (error instanceof _jsonwebtoken.TokenExpiredError) {
      return (0, _helpers.abort)(401, 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập để tiếp tục!');
    }
    if (!(error instanceof _jsonwebtoken.JsonWebTokenError)) {
      throw error;
    }
  }
  (0, _helpers.abort)(401, 'Từ chối truy cập. Token không hợp lệ.');
}