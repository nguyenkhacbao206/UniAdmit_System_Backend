"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _admin = _interopRequireDefault(require("./admin"));
var _user = _interopRequireDefault(require("./user"));
var _auth = _interopRequireDefault(require("./auth.router"));
var _staff = _interopRequireDefault(require("./staff/staff.router"));
var _survey = _interopRequireDefault(require("./staff/survey.router"));
var _application = _interopRequireDefault(require("./staff/application.router"));
var _supplement = _interopRequireDefault(require("./staff/supplement.router"));
var _admission = _interopRequireDefault(require("./staff/admission.router"));
var _supplement2 = _interopRequireDefault(require("./user/supplement.router"));
var _file = _interopRequireDefault(require("./file.router"));
var fileController = _interopRequireWildcard(require("../app/controllers/file.controller"));
var _helpers = require("../utils/helpers");
var _globalAuth = require("../app/middleware/globalAuth.middleware");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function route(app) {
  app.post('/file', (0, _helpers.asyncHandler)(_globalAuth.globalAuth), (0, _helpers.asyncHandler)(fileController.upload));
  app.use('/admin', _admin.default);
  app.use('/user', _user.default);
  app.use('/user/supplements', _supplement2.default);
  app.use('/file', _file.default);
  app.use('/auth', _auth.default);
  app.use('/staff/survey', _survey.default);
  app.use('/staff/applications', _application.default);
  app.use('/staff/supplements', _supplement.default);
  app.use('/staff/admission', _admission.default);
  app.use('/staff', _staff.default);
  app.post('/api/file', (0, _helpers.asyncHandler)(_globalAuth.globalAuth), (0, _helpers.asyncHandler)(fileController.upload));
  app.use('/api/admin', _admin.default);
  app.use('/api/user', _user.default);
  app.use('/api/user/supplements', _supplement2.default);
  app.use('/api/file', _file.default);
  app.use('/api/auth', _auth.default);
  app.use('/api/staff/survey', _survey.default);
  app.use('/api/staff/applications', _application.default);
  app.use('/api/staff/supplements', _supplement.default);
  app.use('/api/staff/admission', _admission.default);
  app.use('/api/staff', _staff.default);
}
var _default = exports.default = route;