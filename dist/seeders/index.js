"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _configs = require("../configs");
var _admin = _interopRequireDefault(require("./admin.seeder"));
var _chalk = _interopRequireDefault(require("chalk"));
var _permissionType = _interopRequireDefault(require("./permission-type.seeder"));
var _permissionGroup = _interopRequireDefault(require("./permission-group.seeder"));
var _permission = _interopRequireDefault(require("./permission.seeder"));
var _role = _interopRequireDefault(require("./role.seeder"));
var _userPermissionGroup = _interopRequireDefault(require("./user-permission-group.seeder"));
var _userPermission = _interopRequireDefault(require("./user-permission.seeder"));
async function seed() {
  await _configs.db.transaction(async function (session) {
    console.log(_chalk.default.bold('Initializing data...'));
    await (0, _permissionType.default)(session);
    await (0, _permissionGroup.default)(session);
    await (0, _permission.default)(session);
    await (0, _role.default)(session);
    await (0, _admin.default)(session);
    await (0, _userPermissionGroup.default)(session);
    await (0, _userPermission.default)(session);
    console.log(_chalk.default.bold('Data has been initialized!'));
  });
}
_configs.db.connect().then(seed).then(_configs.db.close);