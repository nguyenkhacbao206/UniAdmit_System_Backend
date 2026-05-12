"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var enrollmentMiddleware = _interopRequireWildcard(require("../../app/middleware/admin/enrollment.middleware"));
var enrollmentRequest = _interopRequireWildcard(require("../../app/requests/admin/enrollment.request"));
var enrollmentController = _interopRequireWildcard(require("../../app/controllers/admin/enrollment.controller"));
var _helpers = require("../../utils/helpers");
var _permission = require("../../app/middleware/permission");
var _globalAuth = require("../../app/middleware/globalAuth.middleware");
var _express = require("express");
var _validate = _interopRequireDefault(require("../../app/middleware/admin/validate"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const enrollmentRouter = (0, _express.Router)();
enrollmentRouter.use((0, _helpers.asyncHandler)(_globalAuth.globalAuth));
enrollmentRouter.get('/', (0, _helpers.asyncHandler)(enrollmentController.getEnrollmentController));
enrollmentRouter.get('/page', (0, _helpers.asyncHandler)(enrollmentController.getEnrollmentByPage));
enrollmentRouter.get('/search', (0, _helpers.asyncHandler)(enrollmentController.getEnrollmentBySearchController));
enrollmentRouter.get('/:id', (0, _helpers.asyncHandler)(enrollmentMiddleware.checkEnrollmentId), (0, _helpers.asyncHandler)(enrollmentController.getEnrollmentByIdController));
enrollmentRouter.post('/', (0, _helpers.asyncHandler)((0, _permission.allowAccountTypes)('admin')), (0, _helpers.asyncHandler)((0, _permission.requireAdminRoles)('super-admin', 'admin-manager')), (0, _helpers.asyncHandler)((0, _validate.default)(enrollmentRequest.createRequest)), (0, _helpers.asyncHandler)(enrollmentController.createEnollmentController));
enrollmentRouter.put('/:id', (0, _helpers.asyncHandler)((0, _permission.allowAccountTypes)('admin')), (0, _helpers.asyncHandler)((0, _permission.requireAdminRoles)('super-admin', 'admin-manager')), (0, _helpers.asyncHandler)(enrollmentMiddleware.checkEnrollmentId), (0, _helpers.asyncHandler)((0, _validate.default)(enrollmentRequest.updateRequest)), (0, _helpers.asyncHandler)(enrollmentController.updateEnrollmentController));
enrollmentRouter.delete('/:id', (0, _helpers.asyncHandler)((0, _permission.allowAccountTypes)('admin')), (0, _helpers.asyncHandler)((0, _permission.requireAdminRoles)('super-admin', 'admin-manager')), (0, _helpers.asyncHandler)(enrollmentMiddleware.checkEnrollmentId), (0, _helpers.asyncHandler)(enrollmentController.deleteEnrollmentController));
var _default = exports.default = enrollmentRouter;