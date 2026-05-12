"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loginUniversal = loginUniversal;
exports.meUniversal = meUniversal;
var authService = _interopRequireWildcard(require("../services/auth.service"));
var _configs = require("../../configs");
var _helpers = require("../../utils/helpers");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
async function loginUniversal(req, res) {
  const loginResult = await authService.universalLogin(req.body);
  if (loginResult.requires_otp) {
    const user = loginResult.user;
    res.sendMail(user.email, `[${_configs.APP_NAME}] Xác thực đăng nhập`, 'emails/login-otp', {
      name: user.name,
      otp: user.otp,
      appName: _configs.APP_NAME
    });
    res.jsonify({
      requires_otp: true,
      account_type: 'user',
      email: user.email,
      message: 'Vui lòng kiểm tra email để lấy mã xác thực đăng nhập.'
    });
    return;
  }
  res.cookie('refreshToken', loginResult.tokenData.refresh_token, {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  res.jsonify({
    access_token: loginResult.tokenData.access_token,
    expire_in: loginResult.tokenData.expire_in,
    auth_type: loginResult.tokenData.auth_type,
    roles: loginResult.roles,
    account_type: loginResult.account_type
  });
}
async function meUniversal(req, res) {
  if (req.accountType === 'admin') {
    const result = await authService.profileAdmin(req.currentAdmin);
    res.jsonify({
      ...result,
      account_type: 'admin',
      roles: req.currentAdminRoles
    });
  } else if (req.accountType === 'staff') {
    const staffData = req.currentStaff.toObject();
    delete staffData.password;
    res.jsonify({
      ...staffData,
      account_type: 'staff',
      roles: ['staff']
    });
  } else if (req.accountType === 'user') {
    res.jsonify({
      ...req.currentUser.toObject(),
      account_type: 'user',
      roles: ['user']
    });
  } else {
    (0, _helpers.abort)(401);
  }
}