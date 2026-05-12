"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var admissionMethodMiddleware = _interopRequireWildcard(require("../../app/middleware/admin/admission-method.middleware"));
var admissionMethodRequest = _interopRequireWildcard(require("../../app/requests/admin/admission-method.request"));
var admissionMethodController = _interopRequireWildcard(require("../../app/controllers/admin/admission-method.controller"));
var _globalAuth = require("../../app/middleware/globalAuth.middleware");
var _helpers = require("../../utils/helpers");
var _permission = require("../../app/middleware/permission");
var _validate = _interopRequireDefault(require("../../app/middleware/admin/validate"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const admissionMethodRouter = (0, _express.Router)();
admissionMethodRouter.use((0, _helpers.asyncHandler)(_globalAuth.globalAuth));
admissionMethodRouter.get('/', (0, _helpers.asyncHandler)((0, _permission.allowAccountTypes)('admin', 'user')), (0, _helpers.asyncHandler)((0, _validate.default)(admissionMethodRequest.getList)), (0, _helpers.asyncHandler)(admissionMethodController.getAdmissionMethodBySearchController));
admissionMethodRouter.get('/paging', (0, _helpers.asyncHandler)((0, _permission.allowAccountTypes)('admin', 'user')), (0, _helpers.asyncHandler)(admissionMethodController.getAdmissionMethodByPagesController));
admissionMethodRouter.get('/:admissionMethodId', (0, _helpers.asyncHandler)((0, _permission.allowAccountTypes)('admin', 'user')), (0, _helpers.asyncHandler)(admissionMethodMiddleware.checkAdmissionMethodId), (0, _helpers.asyncHandler)(admissionMethodController.getAdmissionMethodByIdController));
admissionMethodRouter.post('/', (0, _helpers.asyncHandler)((0, _permission.allowAccountTypes)('admin')), (0, _helpers.asyncHandler)((0, _permission.requireAdminRoles)('super-admin', 'admin-manager')), (0, _helpers.asyncHandler)((0, _validate.default)(admissionMethodRequest.createItem)), (0, _helpers.asyncHandler)(admissionMethodController.createAdmissionMethodController));
admissionMethodRouter.put('/:admissionMethodId', (0, _helpers.asyncHandler)((0, _permission.allowAccountTypes)('admin')), (0, _helpers.asyncHandler)((0, _permission.requireAdminRoles)('super-admin', 'admin-manager')), (0, _helpers.asyncHandler)(admissionMethodMiddleware.checkAdmissionMethodId), (0, _helpers.asyncHandler)((0, _validate.default)(admissionMethodRequest.updateItem)), (0, _helpers.asyncHandler)(admissionMethodController.updateAdmissionMethodController));
admissionMethodRouter.delete('/:admissionMethodId', (0, _helpers.asyncHandler)((0, _permission.allowAccountTypes)('admin')), (0, _helpers.asyncHandler)((0, _permission.requireAdminRoles)('super-admin', 'admin-manager')), (0, _helpers.asyncHandler)(admissionMethodMiddleware.checkAdmissionMethodId), (0, _helpers.asyncHandler)(admissionMethodController.deleteAdmissionMethodController));
var _default = exports.default = admissionMethodRouter;