"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _models = require("../models");
const permissionData = [{
  code: _models.PERMISSION.SUPER_ADMIN,
  description: 'Quyền truy cập tất cả tính năng trong hệ thống.'
}, {
  code: _models.PERMISSION.LIST_ROLE,
  description: 'Xem danh sách vai trò',
  permission_group_code: 'role-management',
  permission_type_code: 'list'
}, {
  code: _models.PERMISSION.CREATE_ROLE,
  description: 'Tạo mới vai trò',
  permission_group_code: 'role-management',
  permission_type_code: 'create'
}, {
  code: _models.PERMISSION.UPDATE_ROLE,
  description: 'Chỉnh sửa vai trò',
  permission_group_code: 'role-management',
  permission_type_code: 'update'
}, {
  code: _models.PERMISSION.DELETE_ROLE,
  description: 'Xoá vai trò',
  permission_group_code: 'role-management',
  permission_type_code: 'delete'
}, {
  code: _models.PERMISSION.UPDATE_PERMISSION_FOR_ROLE,
  description: 'Chỉnh sửa quyền lại cho vai trò',
  permission_group_code: 'permission-management',
  permission_type_code: 'update'
}];
async function permissionSeeder(session) {
  for (const item of permissionData) {
    const {
      code,
      ...rest
    } = item;
    await _models.Permission.findOneAndUpdate({
      code
    }, {
      $set: rest
    }, {
      upsert: true,
      session
    });
  }
  const permissionCodes = permissionData.map(({
    code
  }) => code);
  const permissionRemove = await _models.Permission.find({
    code: {
      $nin: permissionCodes
    }
  }).distinct('_id').session(session);
  if (permissionRemove.length > 0) {
    await _models.Permission.deleteMany({
      _id: {
        $in: permissionRemove
      }
    }, {
      session
    });
    await _models.Role.updateMany({
      permissions: {
        $in: permissionRemove
      }
    }, {
      $pull: {
        permission_ids: {
          $in: permissionRemove
        }
      }
    }, {
      session
    });
  }
}
var _default = exports.default = permissionSeeder;