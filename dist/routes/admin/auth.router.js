"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _helpers = require("../../utils/helpers");
var _validate = _interopRequireDefault(require("../../app/middleware/admin/validate"));
var _globalAuth = require("../../app/middleware/globalAuth.middleware");
var authRequest = _interopRequireWildcard(require("../../app/requests/admin/auth.request"));
var authController = _interopRequireWildcard(require("../../app/controllers/admin/auth.controller"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const authRouter = (0, _express.Router)();
authRouter.post('/login', (0, _helpers.asyncHandler)((0, _validate.default)(authRequest.login)), (0, _helpers.asyncHandler)(authController.login));
authRouter.post('/logout', (0, _helpers.asyncHandler)(_globalAuth.globalAuth), (0, _helpers.asyncHandler)(authController.logout));
authRouter.post('/refresh-token', (0, _helpers.asyncHandler)(authController.refreshToken));
authRouter.get('/me', (0, _helpers.asyncHandler)(_globalAuth.globalAuth), (0, _helpers.asyncHandler)(authController.me));
var _default = exports.default = authRouter;