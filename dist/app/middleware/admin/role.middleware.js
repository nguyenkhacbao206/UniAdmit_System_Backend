"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.canDelete = canDelete;
exports.canUpdate = canUpdate;
exports.checkAccountId = checkAccountId;
exports.checkPermissionId = checkPermissionId;
exports.checkRoleId = checkRoleId;
var _models = require("../../../models");
var _helpers = require("../../../utils/helpers");
var _mongoose = require("mongoose");
async function checkRoleId(req, res, next) {
  if ((0, _mongoose.isValidObjectId)(req.params.roleId)) {
    const role = await _models.Role.findById(req.params.roleId);
    if (role) {
      req.role = role;
      next();
      return;
    }
  }
  (0, _helpers.abort)(404, 'Không tìm thấy vai trò.');
}
function canUpdate(req, res, next) {
  if (!req.role.can_edit) {
    (0, _helpers.abort)(403, 'Không thể chỉnh sửa vai trò này.');
  }
  next();
}
function canDelete(req, res, next) {
  if (!req.role.can_delete) {
    (0, _helpers.abort)(403, 'Không thể xóa vai trò này.');
  }
  next();
}
async function checkPermissionId(req, res, next) {
  if ((0, _mongoose.isValidObjectId)(req.params.permissionId)) {
    const permission = await _models.Permission.findById(req.params.permissionId);
    if (permission) {
      req.permission = permission;
      next();
      return;
    }
  }
  (0, _helpers.abort)(404, 'Không tìm thấy quyền hạn.');
}
async function checkAccountId(req, res, next) {
  if ((0, _mongoose.isValidObjectId)(req.params.accountId)) {
    const account = await _models.Admin.findById({
      _id: req.params.accountId,
      deleted: false
    });
    if (account) {
      req.account = account;
      next();
      return;
    }
  }
  (0, _helpers.abort)(404, 'Không tìm thấy người dùng.');
}