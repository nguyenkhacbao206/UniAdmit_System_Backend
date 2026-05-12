"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkUniversalToken = checkUniversalToken;
var _helpers = require("../../utils/helpers");
var _configs = require("../../configs");
var _models = require("../../models");
var _auth = require("../services/auth.service");
var _lodash = _interopRequireDefault(require("lodash"));
async function checkUniversalToken(req, res, next) {
  try {
    const token = (0, _helpers.getToken)(req.headers);
    if (!token) {
      (0, _helpers.abort)(401, 'Không có access token.');
    }
    const allowedToken = _lodash.default.isUndefined(await _auth.tokenBlocklist.get(token));
    if (!allowedToken) {
      (0, _helpers.abort)(401, 'Token đã bị vô hiệu hóa.');
    }
    try {
      const {
        adminId,
        roles
      } = (0, _helpers.verifyToken)(token, _configs.TOKEN_TYPE.ADMIN_AUTHORIZATION);
      const admin = await _models.Admin.findOne({
        _id: adminId,
        deleted: false
      });
      if (admin) {
        req.currentAdmin = admin;
        req.currentAdminRoles = roles || [];
        req.accountType = 'admin';
        return next();
      }
    } catch (e) {}
    try {
      const {
        staffId
      } = (0, _helpers.verifyToken)(token, _configs.TOKEN_TYPE.STAFF_AUTHORIZATION);
      const staff = await _models.Staff.findOne({
        _id: staffId,
        deleted: false
      });
      if (staff) {
        req.currentStaff = staff;
        req.accountType = 'staff';
        return next();
      }
    } catch (e) {}
    try {
      const {
        userId
      } = (0, _helpers.verifyToken)(token, _configs.TOKEN_TYPE.USER_AUTHORIZATION);
      const user = await _models.User.findOne({
        _id: userId,
        deleted: false
      });
      if (user) {
        req.currentUser = user;
        req.accountType = 'user';
        return next();
      }
    } catch (e) {}
    (0, _helpers.abort)(401, 'Token không hợp lệ hoặc đã hết hạn.');
  } catch (e) {
    (0, _helpers.abort)(401, 'Xác thực thất bại.');
  }
}