"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _models = require("../models");
const permissionTypeData = [{
  name: 'Truy cập',
  code: 'list'
}, {
  name: 'Tạo mới',
  code: 'create'
}, {
  name: 'Chỉnh sửa',
  code: 'update'
}, {
  name: 'Xoá',
  code: 'delete'
}, {
  name: 'Xem chi tiết',
  code: 'read'
}];
async function permissionTypeSeeder(session) {
  for (const [position, item] of permissionTypeData.entries()) {
    const {
      code,
      ...rest
    } = item;
    await _models.PermissionType.findOneAndUpdate({
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
  await _models.PermissionType.deleteMany({
    code: {
      $nin: permissionTypeData.map(({
        code
      }) => code)
    }
  }, {
    session
  });
}
var _default = exports.default = permissionTypeSeeder;