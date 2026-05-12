"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requireAdminRoles = exports.allowAccountTypes = void 0;
var _helpers = require("../../utils/helpers");
var _models = require("../../models");
const allowAccountTypes = (...allowedUserTypes) => {
  return async (req, res, next) => {
    const userType = req.userType || 'unknown';
    await Promise.resolve();
    if (!allowedUserTypes.includes(userType)) {
      return (0, _helpers.abort)(403, 'Tài khoản của bạn không có đặc quyền truy cập tính năng này!');
    }
    next();
  };
};
exports.allowAccountTypes = allowAccountTypes;
const requireAdminRoles = (...allowedRoleCodes) => {
  return async (req, res, next) => {
    try {
      const userType = req.userType;
      if (userType === 'user') {
        return (0, _helpers.abort)(403, 'Người dùng thông thường không thể thao tác quyền quản trị!');
      }
      const currentUser = userType === 'admin' ? req.currentAdmin : req.currentStaff;
      if (!currentUser) {
        return (0, _helpers.abort)(401, 'Vui lòng đăng nhập để thực hiện hành động này!');
      }
      if (allowedRoleCodes.length === 0) {
        return next();
      }
      if (!currentUser.role_ids || currentUser.role_ids.length === 0) {
        return (0, _helpers.abort)(403, 'Tài khoản chưa được phân quyền trên hệ thống!');
      }
      const userRoles = await _models.Role.find({
        _id: {
          $in: currentUser.role_ids
        }
      });
      const userRoleCodes = userRoles.map(r => r.code);
      const hasAccess = userRoleCodes.some(code => allowedRoleCodes.includes(code));
      if (!hasAccess) {
        return (0, _helpers.abort)(403, 'Bạn không đủ quyền để thực hiện thao tác này!');
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
exports.requireAdminRoles = requireAdminRoles;