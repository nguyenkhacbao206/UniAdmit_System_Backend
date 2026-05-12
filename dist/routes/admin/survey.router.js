"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var surveyController = _interopRequireWildcard(require("../../app/controllers/admin/survey.controller"));
var _helpers = require("../../utils/helpers");
var _globalAuth = require("../../app/middleware/globalAuth.middleware");
var _permission = require("../../app/middleware/permission");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const surveyRouter = _express.default.Router();
surveyRouter.use((0, _helpers.asyncHandler)(_globalAuth.globalAuth), (0, _helpers.asyncHandler)((0, _permission.allowAccountTypes)('admin')));
surveyRouter.patch('/questions/:id/approve', (0, _helpers.asyncHandler)(surveyController.approveQuestion));
var _default = exports.default = surveyRouter;