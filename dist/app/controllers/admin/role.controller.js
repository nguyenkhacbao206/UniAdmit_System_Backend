"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addAccountsForRole = addAccountsForRole;
exports.createItem = createItem;
exports.deleteAccountInRole = deleteAccountInRole;
exports.deleteItem = deleteItem;
exports.readAccountsWithRole = readAccountsWithRole;
exports.readAccountsWithoutRole = readAccountsWithoutRole;
exports.readPermissionTypes = readPermissionTypes;
exports.readPermissionsOfRole = readPermissionsOfRole;
exports.readRoot = readRoot;
exports.switchPermissionOfRole = switchPermissionOfRole;
exports.updateItem = updateItem;
var roleService = _interopRequireWildcard(require("../../services/role.service"));
var _configs = require("../../../configs");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
async function readRoot(req, res) {
  const data = await roleService.treeData();
  res.jsonify(data);
}
async function readPermissionTypes(req, res) {
  const result = await roleService.listPermissionType();
  res.jsonify(result);
}
async function createItem(req, res) {
  await _configs.db.transaction(async function (session) {
    await roleService.create(session, req.body);
    res.status(201).jsonify();
  });
}
async function updateItem(req, res) {
  await _configs.db.transaction(async function (session) {
    await roleService.update(session, req.role, req.body);
    res.status(201).jsonify();
  });
}
async function deleteItem(req, res) {
  await _configs.db.transaction(async function (session) {
    await roleService.deleteRoleWithChildren(session, req.role);
    res.jsonify();
  });
}
async function readPermissionsOfRole(req, res) {
  const data = await roleService.getPermissionOfRole(req.role);
  res.jsonify(data);
}
async function switchPermissionOfRole(req, res) {
  await _configs.db.transaction(async function (session) {
    await roleService.switchPermission(session, req.role, req.permission);
    res.status(201).jsonify();
  });
}
async function readAccountsWithRole(req, res) {
  const data = await roleService.readAccounts(req.role, true, req.query);
  res.jsonify(data);
}
async function readAccountsWithoutRole(req, res) {
  const data = await roleService.readAccounts(req.role, false, req.query);
  res.jsonify(data);
}
async function addAccountsForRole(req, res) {
  await _configs.db.transaction(async function (session) {
    await roleService.addAccountsForRole(session, req.role, req.body.account_ids);
    res.status(201).jsonify();
  });
}
async function deleteAccountInRole(req, res) {
  await _configs.db.transaction(async function (session) {
    await roleService.deleteAccountsInRole(session, req.role, req.account);
    res.status(201).jsonify();
  });
}