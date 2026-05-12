"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _models = require("../models");
const permissionGroupData = [{
  name: 'Quản lý câu lạc bộ',
  code: 'club-management'
}];
async function userPermissionGroupSeeder(session) {
  for (const [position, item] of permissionGroupData.entries()) {
    const {
      code,
      ...rest
    } = item;
    await _models.UserPermissionGroup.findOneAndUpdate({
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
  await _models.UserPermissionGroup.deleteMany({
    code: {
      $nin: permissionGroupData.map(({
        code
      }) => code)
    }
  }, {
    session
  });
}
var _default = exports.default = userPermissionGroupSeeder;