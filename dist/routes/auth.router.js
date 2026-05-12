"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _helpers = require("../utils/helpers");
var _validate = _interopRequireDefault(require("../app/middleware/admin/validate"));
var authController = _interopRequireWildcard(require("../app/controllers/user/auth.controller"));
var globalAuthController = _interopRequireWildcard(require("../app/controllers/auth.controller"));
var authRequest = _interopRequireWildcard(require("../app/requests/auth.request"));
var _auth4 = require("../app/middleware/auth");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const authRouter = (0, _express.Router)();
authRouter.get('/google', (0, _helpers.asyncHandler)(authController.googleAuth));
authRouter.get('/google/callback', (0, _helpers.asyncHandler)(authController.googleCallback));
authRouter.post('/login', (0, _helpers.asyncHandler)((0, _validate.default)(authRequest.loginUniversal)), (0, _helpers.asyncHandler)(globalAuthController.loginUniversal));
authRouter.get('/me', (0, _helpers.asyncHandler)(_auth4.checkUniversalToken), (0, _helpers.asyncHandler)(globalAuthController.meUniversal));
var _default = exports.default = authRouter;