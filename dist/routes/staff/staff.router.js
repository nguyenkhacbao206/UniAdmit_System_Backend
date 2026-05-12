"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var staffController = _interopRequireWildcard(require("../../app/controllers/staff/staff.controller"));
var staffRequest = _interopRequireWildcard(require("../../app/requests/staff/staff.request"));
var _helpers = require("../../utils/helpers");
var _validate = _interopRequireDefault(require("../../app/middleware/admin/validate"));
var _globalAuth = require("../../app/middleware/globalAuth.middleware");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const staffRouter = (0, _express.Router)();
staffRouter.use((0, _helpers.asyncHandler)(_globalAuth.globalAuth));
staffRouter.get('/', (0, _helpers.asyncHandler)(staffController.getStaffController));
staffRouter.get('/:id', (0, _helpers.asyncHandler)(staffController.getStaffByIdController));
staffRouter.post('/', (0, _helpers.asyncHandler)((0, _validate.default)(staffRequest.createStaff)), (0, _helpers.asyncHandler)(staffController.createStaffController));
staffRouter.put('/:id', (0, _helpers.asyncHandler)((0, _validate.default)(staffRequest.updateStaff)), (0, _helpers.asyncHandler)(staffController.updateStaffController));
staffRouter.delete('/:id', (0, _helpers.asyncHandler)(staffController.deleteStaffController));
staffRouter.post('/search', (0, _helpers.asyncHandler)(staffController.getStaffBySearchController));
staffRouter.post('/pages', (0, _helpers.asyncHandler)(staffController.getStaffByPagesController));
var _default = exports.default = staffRouter;