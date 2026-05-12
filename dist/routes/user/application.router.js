"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var applicationController = _interopRequireWildcard(require("../../app/controllers/user/application.controller"));
var _helpers = require("../../utils/helpers");
var _globalAuth = require("../../app/middleware/globalAuth.middleware");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const applicationRouter = (0, _express.Router)();
applicationRouter.use((0, _helpers.asyncHandler)(_globalAuth.globalAuth));
applicationRouter.post('/', (0, _helpers.asyncHandler)(applicationController.create));
applicationRouter.get('/my', (0, _helpers.asyncHandler)(applicationController.getMyApplications));
applicationRouter.get('/my-result', (0, _helpers.asyncHandler)(applicationController.getMyResult));
applicationRouter.post('/confirm-admission', (0, _helpers.asyncHandler)(applicationController.confirmAdmission));
applicationRouter.delete('/:id', (0, _helpers.asyncHandler)(applicationController.deleteApplication));
var _default = exports.default = applicationRouter;