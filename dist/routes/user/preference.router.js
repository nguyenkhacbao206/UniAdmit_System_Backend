"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var preferenceController = _interopRequireWildcard(require("../../app/controllers/user/preference.controller.js"));
var preferenceRequest = _interopRequireWildcard(require("../../app/requests/user/preference.request.js"));
var preferenceMiddleware = _interopRequireWildcard(require("../../app/middleware/user/preference.middleware.js"));
var _globalAuthMiddleware = require("../../app/middleware/globalAuth.middleware.js");
var _validate = _interopRequireDefault(require("../../app/middleware/user/validate.js"));
var _helpers = require("../../utils/helpers");
var _express = require("express");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const preferenceRouter = (0, _express.Router)();
preferenceRouter.use((0, _helpers.asyncHandler)(_globalAuthMiddleware.globalAuth));
preferenceRouter.get('/', (0, _helpers.asyncHandler)(preferenceController.getList));
preferenceRouter.post('/', (0, _helpers.asyncHandler)((0, _validate.default)(preferenceRequest.add)), (0, _helpers.asyncHandler)(preferenceController.add));
preferenceRouter.patch('/reorder', (0, _helpers.asyncHandler)((0, _validate.default)(preferenceRequest.reorder)), (0, _helpers.asyncHandler)(preferenceController.reorder));
preferenceRouter.post('/confirm', (0, _helpers.asyncHandler)(preferenceController.confirm));
preferenceRouter.post('/unlock', (0, _helpers.asyncHandler)(preferenceController.unlock));
preferenceRouter.get('/result', (0, _helpers.asyncHandler)(preferenceController.getResult));
preferenceRouter.delete('/:id', (0, _helpers.asyncHandler)(preferenceMiddleware.checkPreferenceId), (0, _helpers.asyncHandler)(preferenceController.remove));
var _default = exports.default = preferenceRouter;