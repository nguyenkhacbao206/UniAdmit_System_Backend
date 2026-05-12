"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var universitiesMiddleware = _interopRequireWildcard(require("../../app/middleware/admin/universities.middleware"));
var universitiesRequest = _interopRequireWildcard(require("../../app/requests/admin/universities.request"));
var universitiesController = _interopRequireWildcard(require("../../app/controllers/admin/universities.controller"));
var _globalAuth = require("../../app/middleware/globalAuth.middleware");
var _helpers = require("../../utils/helpers");
var _permission = require("../../app/middleware/permission");
var _express = require("express");
var _validate = _interopRequireDefault(require("../../app/middleware/admin/validate"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const universityRouter = (0, _express.Router)();
universityRouter.use((0, _helpers.asyncHandler)(_globalAuth.globalAuth));
universityRouter.get('/', (0, _helpers.asyncHandler)((0, _permission.allowAccountTypes)('admin', 'user')), (0, _helpers.asyncHandler)((0, _validate.default)(universitiesRequest.getList)), (0, _helpers.asyncHandler)(universitiesController.getUniversitiesController));
universityRouter.get('/page', (0, _helpers.asyncHandler)((0, _permission.allowAccountTypes)('admin', 'user')), (0, _helpers.asyncHandler)(universitiesController.getUniversityByPage));
universityRouter.get('/:id', (0, _helpers.asyncHandler)((0, _permission.allowAccountTypes)('admin', 'user')), (0, _helpers.asyncHandler)(universitiesMiddleware.checkUniversityId), (0, _helpers.asyncHandler)(universitiesController.getUniversityByIdController));
universityRouter.post('/', (0, _helpers.asyncHandler)((0, _permission.allowAccountTypes)('admin')), (0, _helpers.asyncHandler)((0, _permission.requireAdminRoles)('super-admin', 'admin-manager')), (0, _helpers.asyncHandler)((0, _validate.default)(universitiesRequest.createItem)), (0, _helpers.asyncHandler)(universitiesController.createUniversitiesController));
universityRouter.put('/:id', (0, _helpers.asyncHandler)((0, _permission.allowAccountTypes)('admin')), (0, _helpers.asyncHandler)((0, _permission.requireAdminRoles)('super-admin', 'admin-manager')), (0, _helpers.asyncHandler)(universitiesMiddleware.checkUniversityId), (0, _helpers.asyncHandler)((0, _validate.default)(universitiesRequest.updateItem)), (0, _helpers.asyncHandler)(universitiesController.updateUniversitiesController));
universityRouter.delete('/:id', (0, _helpers.asyncHandler)((0, _permission.allowAccountTypes)('admin')), (0, _helpers.asyncHandler)((0, _permission.requireAdminRoles)('super-admin', 'admin-manager')), (0, _helpers.asyncHandler)(universitiesMiddleware.checkUniversityId), (0, _helpers.asyncHandler)(universitiesController.deleteUniversitiesController));
var _default = exports.default = universityRouter;