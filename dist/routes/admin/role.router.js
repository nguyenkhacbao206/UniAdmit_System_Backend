"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var roleMiddleware = _interopRequireWildcard(require("../../app/middleware/admin/role.middleware"));
var roleRequest = _interopRequireWildcard(require("../../app/requests/admin/role.request"));
var roleController = _interopRequireWildcard(require("../../app/controllers/admin/role.controller"));
var _permission = require("../../app/middleware/permission");
var _globalAuth = require("../../app/middleware/globalAuth.middleware");
var _helpers = require("../../utils/helpers");
var _express = require("express");
var _validate = _interopRequireDefault(require("../../app/middleware/admin/validate"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const roleRouter = (0, _express.Router)();
roleRouter.use((0, _helpers.asyncHandler)(_globalAuth.globalAuth));
roleRouter.get('/', (0, _helpers.asyncHandler)(roleController.readRoot));
roleRouter.get('/permission-types', (0, _helpers.asyncHandler)(roleController.readPermissionTypes));
roleRouter.post('/', (0, _helpers.asyncHandler)((0, _permission.allowAccountTypes)('admin')), (0, _helpers.asyncHandler)((0, _permission.requireAdminRoles)('super-admin')), (0, _helpers.asyncHandler)((0, _validate.default)(roleRequest.createItem)), (0, _helpers.asyncHandler)(roleController.createItem));
roleRouter.put('/:roleId', (0, _helpers.asyncHandler)((0, _permission.allowAccountTypes)('admin')), (0, _helpers.asyncHandler)((0, _permission.requireAdminRoles)('super-admin')), (0, _helpers.asyncHandler)(roleMiddleware.checkRoleId), roleMiddleware.canUpdate, (0, _helpers.asyncHandler)((0, _validate.default)(roleRequest.updateItem)), (0, _helpers.asyncHandler)(roleController.updateItem));
roleRouter.delete('/:roleId', (0, _helpers.asyncHandler)((0, _permission.allowAccountTypes)('admin')), (0, _helpers.asyncHandler)((0, _permission.requireAdminRoles)('super-admin')), (0, _helpers.asyncHandler)(roleMiddleware.checkRoleId), roleMiddleware.canDelete, (0, _helpers.asyncHandler)(roleController.deleteItem));
roleRouter.get('/:roleId/permissions', (0, _helpers.asyncHandler)(roleMiddleware.checkRoleId), (0, _helpers.asyncHandler)(roleController.readPermissionsOfRole));
roleRouter.patch('/:roleId/update-permission-for-role/:permissionId', (0, _helpers.asyncHandler)((0, _permission.allowAccountTypes)('admin')), (0, _helpers.asyncHandler)((0, _permission.requireAdminRoles)('super-admin')), (0, _helpers.asyncHandler)(roleMiddleware.checkRoleId), roleMiddleware.canUpdate, (0, _helpers.asyncHandler)(roleMiddleware.checkPermissionId), (0, _helpers.asyncHandler)(roleController.switchPermissionOfRole));
roleRouter.get('/:roleId/accounts', (0, _helpers.asyncHandler)(roleMiddleware.checkRoleId), (0, _helpers.asyncHandler)((0, _validate.default)(roleRequest.readAccounts)), (0, _helpers.asyncHandler)(roleController.readAccountsWithRole));
roleRouter.get('/:roleId/accounts-without-role', (0, _helpers.asyncHandler)(roleMiddleware.checkRoleId), (0, _helpers.asyncHandler)((0, _validate.default)(roleRequest.readAccounts)), (0, _helpers.asyncHandler)(roleController.readAccountsWithoutRole));
roleRouter.patch('/:roleId/add-accounts', (0, _helpers.asyncHandler)((0, _permission.allowAccountTypes)('admin')), (0, _helpers.asyncHandler)((0, _permission.requireAdminRoles)('super-admin')), (0, _helpers.asyncHandler)(roleMiddleware.checkRoleId), roleMiddleware.canUpdate, (0, _helpers.asyncHandler)((0, _validate.default)(roleRequest.addAccountsForRole)), (0, _helpers.asyncHandler)(roleController.addAccountsForRole));
roleRouter.delete('/:roleId/delete-account-in-role/:accountId', (0, _helpers.asyncHandler)((0, _permission.allowAccountTypes)('admin')), (0, _helpers.asyncHandler)((0, _permission.requireAdminRoles)('super-admin')), (0, _helpers.asyncHandler)(roleMiddleware.checkRoleId), roleMiddleware.canUpdate, (0, _helpers.asyncHandler)(roleMiddleware.checkAccountId), (0, _helpers.asyncHandler)(roleController.deleteAccountInRole));
var _default = exports.default = roleRouter;