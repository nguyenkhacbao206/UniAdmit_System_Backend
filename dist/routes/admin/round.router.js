"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var roundController = _interopRequireWildcard(require("../../app/controllers/admin/round.controller"));
var _helpers = require("../../utils/helpers");
var _globalAuth = require("../../app/middleware/globalAuth.middleware");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const roundRouter = (0, _express.Router)();
roundRouter.use((0, _helpers.asyncHandler)(_globalAuth.globalAuth));
roundRouter.get('/', (0, _helpers.asyncHandler)(roundController.getAll));
roundRouter.get('/page', (0, _helpers.asyncHandler)(roundController.getByPage));
roundRouter.get('/:id', (0, _helpers.asyncHandler)(roundController.getById));
roundRouter.post('/', (0, _helpers.asyncHandler)(roundController.create));
roundRouter.put('/:id', (0, _helpers.asyncHandler)(roundController.update));
roundRouter.patch('/:id/status', (0, _helpers.asyncHandler)(roundController.updateStatus));
roundRouter.delete('/:id', (0, _helpers.asyncHandler)(roundController.remove));
var _default = exports.default = roundRouter;