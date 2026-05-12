"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.forgotPassword = forgotPassword;
exports.googleAuth = void 0;
exports.googleCallback = googleCallback;
exports.login = login;
exports.logout = logout;
exports.refreshToken = refreshToken;
exports.register = register;
exports.resendOtp = resendOtp;
exports.resetPassword = resetPassword;
exports.verifyForgotPasswordOTP = verifyForgotPasswordOTP;
exports.verifyLoginOTP = verifyLoginOTP;
exports.verifyOTP = verifyOTP;
var _googleapis = require("googleapis");
var _helpers = require("../../../utils/helpers");
var _configs = require("../../../configs");
var authService = _interopRequireWildcard(require("../../services/auth.service"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
async function login(req, res) {
  const user = await authService.checkValidLoginUser(req.body);
  if (user) {
    await authService.updateOTP(user);
    res.sendMail(user.email, `[${_configs.APP_NAME}] Xác thực đăng nhập`, 'emails/login-otp', {
      name: user.name,
      otp: user.otp,
      appName: _configs.APP_NAME
    });
    res.jsonify({
      message: 'Vui lòng kiểm tra email để lấy mã xác thực đăng nhập.',
      email: user.email
    });
  } else {
    (0, _helpers.abort)(400, 'Tài khoản hoặc mật khẩu không đúng.');
  }
}
async function verifyLoginOTP(req, res) {
  const user = await authService.verifyOTP(req.body, false);
  const tokenData = authService.authTokenUser(user);
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
  }, 'Đăng nhập thành công.');
}
async function register(req, res) {
  const user = await authService.registerUser(req.body);
  res.sendMail(user.email, `[${_configs.APP_NAME}] Xác thực tài khoản`, 'emails/verify-otp', {
    name: user.name,
    otp: user.otp,
    appName: _configs.APP_NAME
  });
  res.jsonify({
    message: 'Đăng ký tài khoản thành công. Vui lòng kiểm tra email để lấy mã xác thực.',
    email: user.email
  });
}
async function verifyOTP(req, res) {
  const user = await authService.verifyOTP(req.body);
  res.jsonify({
    message: 'Xác thực tài khoản thành công. Bạn có thể đăng nhập ngay bây giờ.',
    user
  });
}
async function resendOtp(req, res) {
  const {
    email
  } = req.body;
  const user = await authService.resendOTP(email);
  res.sendMail(user.email, `[${_configs.APP_NAME}] Mã xác thực mới`, 'emails/verify-otp', {
    name: user.name,
    otp: user.otp,
    appName: _configs.APP_NAME
  });
  res.jsonify({
    message: 'Mã xác thực mới đã được gửi vào email của bạn.',
    email: user.email
  });
}
async function forgotPassword(req, res) {
  const {
    email
  } = req.body;
  const user = await authService.resendOTP(email);
  res.sendMail(user.email, `[${_configs.APP_NAME}] Xác thực quên mật khẩu`, 'emails/forgot-password-otp', {
    name: user.name,
    otp: user.otp,
    appName: _configs.APP_NAME
  });
  res.jsonify({
    message: 'Mã xác thực quên mật khẩu đã được gửi vào email của bạn.',
    email: user.email
  });
}
async function verifyForgotPasswordOTP(req, res) {
  const user = await authService.verifyOTP(req.body, false);
  res.jsonify({
    message: 'Xác thực mã OTP thành công. Vui lòng đặt lại mật khẩu mới.',
    email: user.email
  });
}
async function resetPassword(req, res) {
  await authService.resetPassword(req.body);
  res.jsonify('Đặt lại mật khẩu thành công. Bạn có thể đăng nhập bằng mật khẩu mới.');
}
async function logout(req, res) {
  const token = (0, _helpers.getToken)(req.headers);
  if (token) {
    await authService.blockToken(token);
  }
  res.clearCookie('refreshToken');
  res.jsonify('Đăng xuất thành công.');
}
const googleAuth = async (req, res) => {
  const oauth2Client = new _googleapis.google.auth.OAuth2(_configs.GOOGLE_CLIENT_ID, _configs.GOOGLE_CLIENT_SECRET, _configs.GOOGLE_CALLBACK_URL);
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
  });
  res.redirect(url);
};
exports.googleAuth = googleAuth;
async function googleCallback(req, res) {
  const {
    code
  } = req.query;
  const oauth2Client = new _googleapis.google.auth.OAuth2(_configs.GOOGLE_CLIENT_ID, _configs.GOOGLE_CLIENT_SECRET, _configs.GOOGLE_CALLBACK_URL);
  const {
    tokens
  } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  const oauth2 = _googleapis.google.oauth2({
    auth: oauth2Client,
    version: 'v2'
  });
  const {
    data
  } = await oauth2.userinfo.get();
  const user = await authService.findOrCreateUserByGoogle(data);
  const tokenData = authService.authTokenUser(user);
  res.cookie('refreshToken', tokenData.refresh_token, {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  const urlClient = new URL(`${_configs.APP_URL_CLIENT}/google-oauth-callback`);
  urlClient.searchParams.append('access_token', tokenData.access_token);
  urlClient.searchParams.append('expire_in', tokenData.expire_in);
  res.redirect(urlClient.toString());
}
async function refreshToken(req, res) {
  const refresh_token = req.cookies?.refreshToken;
  if (!refresh_token) {
    (0, _helpers.abort)(400, 'Không tìm thấy refresh token.');
  }
  const tokenData = await authService.refreshUserToken(refresh_token);
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