"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _models = require("../models");
const permissionCensor = [{
  code: _models.USER_PERMISSION.ACCEPT_MEMBER,
  description: 'Xem danh sách vai trò',
  permission_group_code: 'club-management',
  permission_type_code: 'create'
}];
const permissionData = [{
  code: _models.USER_PERMISSION.REMOVE_MEMBER,
  description: 'Xem danh sách vai trò',
  permission_group_code: 'club-management',
  permission_type_code: 'delete'
}, ...permissionCensor];
async function userPermissionSeeder(session) {
  for (const item of permissionData) {
    const {
      code,
      ...rest
    } = item;
    await _models.UserPermission.findOneAndUpdate({
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
  const permissionRemove = await _models.UserPermission.find({
    code: {
      $nin: permissionCodes
    }
  }).distinct('_id').session(session);
  if (permissionRemove.length > 0) {
    await _models.UserPermission.deleteMany({
      _id: {
        $in: permissionRemove
      }
    }, {
      session
    });
  }
  const managerPermissionCodes = permissionData.map(item => item.code);
  const managerClubPermission = await _models.UserPermission.find({
    code: {
      $in: managerPermissionCodes
    }
  }).distinct('_id').session(session);
  await _models.UserRole.findOneAndUpdate({
    code: _models.USER_ROLE.MANAGER
  }, {
    $set: {
      name: 'Quản lý hệ thống',
      code: _models.USER_ROLE.MANAGER,
      description: 'Có các quyền quản lý câu lạc bộ',
      can_delete: false,
      permission_ids: managerClubPermission
    }
  }, {
    upsert: true,
    session
  });
  const censorPermissionCodes = permissionCensor.map(item => item.code);
  const censorClubPermission = await _models.UserPermission.find({
    code: {
      $in: censorPermissionCodes
    }
  }).distinct('_id').session(session);
  await _models.UserRole.findOneAndUpdate({
    code: _models.USER_ROLE.CENSOR
  }, {
    $set: {
      name: 'Quản lý kiểm duyệt',
      code: _models.USER_ROLE.CENSOR,
      description: 'Có các quyền kiểm duyệt',
      can_delete: false,
      permission_ids: censorClubPermission
    }
  }, {
    upsert: true,
    session
  });
}
var _default = exports.default = userPermissionSeeder;