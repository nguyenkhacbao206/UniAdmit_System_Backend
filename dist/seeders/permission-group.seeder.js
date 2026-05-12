"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _models = require("../models");
const permissionGroupData = [{
  name: 'Quản lý vai trò',
  code: 'role-management'
}, {
  name: 'Quản lý quyền hạn',
  code: 'permission-management',
  parent_code: 'role-management'
}];
async function permissionGroupSeeder(session) {
  for (const [position, item] of permissionGroupData.entries()) {
    const {
      code,
      ...rest
    } = item;
    await _models.PermissionGroup.findOneAndUpdate({
      code
    }, {
      $set: {
        ...rest,
        position
      }
    }, {
      upsert: true,
      session
    });
  }
  await _models.PermissionGroup.deleteMany({
    code: {
      $nin: permissionGroupData.map(({
        code
      }) => code)
    }
  }, {
    session
  });
}
var _default = exports.default = permissionGroupSeeder;