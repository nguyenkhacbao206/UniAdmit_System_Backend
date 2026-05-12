"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var majorMiddleware = _interopRequireWildcard(require("../../app/middleware/admin/major.middleware"));
var majorRequest = _interopRequireWildcard(require("../../app/requests/admin/major.request"));
var majorController = _interopRequireWildcard(require("../../app/controllers/admin/major.controller"));
var _globalAuth = require("../../app/middleware/globalAuth.middleware");
var _helpers = require("../../utils/helpers");
var _permission = require("../../app/middleware/permission");
var _express = require("express");
var _validate = _interopRequireDefault(require("../../app/middleware/admin/validate"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const majorRouter = (0, _express.Router)();
majorRouter.use((0, _helpers.asyncHandler)(_globalAuth.globalAuth));
majorRouter.get('/', (0, _helpers.asyncHandler)((0, _permission.allowAccountTypes)('admin', 'user', 'staff')), (0, _helpers.asyncHandler)(majorController.getMajorController));
majorRouter.get('/page', (0, _helpers.asyncHandler)((0, _permission.allowAccountTypes)('admin', 'user', 'staff')), (0, _helpers.asyncHandler)(majorController.getMajorByPage));
majorRouter.get('/search', (0, _helpers.asyncHandler)((0, _permission.allowAccountTypes)('admin', 'user', 'staff')), (0, _helpers.asyncHandler)(majorController.getMajorBySearchController));
majorRouter.get('/:id', (0, _helpers.asyncHandler)((0, _permission.allowAccountTypes)('admin', 'user', 'staff')), (0, _helpers.asyncHandler)(majorMiddleware.checkMajorId), (0, _helpers.asyncHandler)(majorController.getMajorByIdController));
majorRouter.post('/', (0, _helpers.asyncHandler)((0, _permission.allowAccountTypes)('admin')), (0, _helpers.asyncHandler)((0, _permission.requireAdminRoles)('super-admin', 'admin-manager')), (0, _helpers.asyncHandler)((0, _validate.default)(majorRequest.createItem)), (0, _helpers.asyncHandler)(majorController.createMajorController));
majorRouter.put('/:id', (0, _helpers.asyncHandler)((0, _permission.allowAccountTypes)('admin')), (0, _helpers.asyncHandler)((0, _permission.requireAdminRoles)('super-admin', 'admin-manager')), (0, _helpers.asyncHandler)(majorMiddleware.checkMajorId), (0, _helpers.asyncHandler)((0, _validate.default)(majorRequest.updateItem)), (0, _helpers.asyncHandler)(majorController.updateMajorController));
majorRouter.delete('/:id', (0, _helpers.asyncHandler)((0, _permission.allowAccountTypes)('admin')), (0, _helpers.asyncHandler)((0, _permission.requireAdminRoles)('super-admin', 'admin-manager')), (0, _helpers.asyncHandler)(majorMiddleware.checkMajorId), (0, _helpers.asyncHandler)(majorController.daleteMajorController));
var _default = exports.default = majorRouter;