"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.login = login;
exports.logout = logout;
exports.me = me;
exports.refreshToken = refreshToken;
var _helpers = require("../../../utils/helpers");
var authService = _interopRequireWildcard(require("../../services/auth.service"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
async function login(req, res) {
  const validLogin = await authService.checkValidLoginAdmin(req.body);
  if (!validLogin) {
    (0, _helpers.abort)(400, 'Số điện thoại hoặc mật khẩu không đúng.');
  }
  const tokenData = authService.authToken(validLogin);
  res.cookie('refreshToken', tokenData.refresh_token, {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  res.jsonify({
    access_token: tokenData.access_token,
    expire_in: tokenData.expire_in,
    auth_type: tokenData.auth_type
  });
}
async function logout(req, res) {
  const token = (0, _helpers.getToken)(req.headers);
  if (token) {
    await authService.blockToken(token);
  }
  res.clearCookie('refreshToken');
  res.jsonify('Đăng xuất thành công.');
}
async function me(req, res) {
  const result = await authService.profileAdmin(req.currentAdmin);
  res.jsonify(result);
}
async function refreshToken(req, res) {
  const refresh_token = req.cookies?.refreshToken;
  if (!refresh_token) {
    (0, _helpers.abort)(400, 'Không tìm thấy refresh token.');
  }
  const tokenData = await authService.refreshAdminToken(refresh_token);
  res.cookie('refreshToken', tokenData.refresh_token, {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  res.jsonify({
    access_token: tokenData.access_token,
    expire_in: tokenData.expire_in,
    auth_type: tokenData.auth_type
  });
}