"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _auth = _interopRequireDefault(require("./auth.router"));
var _role = _interopRequireDefault(require("./role.router"));
var _staff = _interopRequireDefault(require("./staff.router"));
var _universities = _interopRequireDefault(require("./universities.router"));
var _major = _interopRequireDefault(require("./major.router"));
var _enrollment = _interopRequireDefault(require("./enrollment.router"));
var _admission = _interopRequireDefault(require("./admission"));
var _survey = _interopRequireDefault(require("./survey.router"));
var _payment = _interopRequireDefault(require("./payment.router"));
var _round = _interopRequireDefault(require("./round.router"));
var _admission2 = _interopRequireDefault(require("./admission.router"));
const admin = (0, _express.Router)();
admin.use('/auth', _auth.default);
admin.use('/roles', _role.default);
admin.use('/staff', _staff.default);
admin.use('/universities', _universities.default);
admin.use('/majors', _major.default);
admin.use('/enrollments', _enrollment.default);
admin.use('/admission-method', _admission.default);
admin.use('/survey', _survey.default);
admin.use('/payment', _payment.default);
admin.use('/rounds', _round.default);
admin.use('/admission', _admission2.default);
var _default = exports.default = admin;