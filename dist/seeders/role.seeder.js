"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _models = require("../models");
const superAdminRole = {
  name: 'Super Admin',
  code: 'super-admin',
  description: 'Có toàn quyền trong hệ thống',
  can_delete: false,
  can_edit: false
};
const roleData = [{
  name: 'Quản trị viên (Admin)',
  code: 'admin',
  description: 'Quản lý toàn bộ cấu hình hệ thống',
  can_delete: false,
  can_edit: true
}, {
  name: 'Nhân viên (Staff)',
  code: 'staff',
  description: 'Xử lý hồ sơ và các tác vụ vận hành',
  can_delete: false,
  can_edit: true
}, {
  name: 'Người dùng (User Role)',
  code: 'user-manager',
  description: 'Phân quyền cho đối tượng người dùng cuối',
  can_delete: false,
  can_edit: true
}];
async function roleSeeder(session) {
  const superAdminPermissions = await _models.Permission.find({
    code: _models.PERMISSION.SUPER_ADMIN
  }).distinct('_id').session(session);
  await _models.Role.findOneAndUpdate({
    code: superAdminRole.code
  }, {
    $set: {
      ...superAdminRole,
      permission_ids: superAdminPermissions
    }
  }, {
    upsert: true,
    session
  });
  async function dfs(roles, parent_id = null) {
    for (const {
      code,
      children,
      ...role
    } of roles) {
      const parent = await _models.Role.findOneAndUpdate({
        code
      }, {
        $set: {
          ...role,
          parent_id
        }
      }, {
        upsert: true,
        new: true,
        session
      });
      if (children) {
        await dfs(children, parent._id);
      }
    }
  }
  await dfs(roleData);
}
var _default = exports.default = roleSeeder;