"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _auth = _interopRequireDefault(require("./auth.router"));
var _profile = _interopRequireDefault(require("./profile.router"));
var _score = _interopRequireDefault(require("./score.router"));
var _academicScore = _interopRequireDefault(require("./academic-score.router"));
var _preference = _interopRequireDefault(require("./preference.router"));
var _survey = _interopRequireDefault(require("./survey.router"));
var _payment = _interopRequireDefault(require("./payment.router"));
var _enrollment = _interopRequireDefault(require("./enrollment.router"));
var _notification = _interopRequireDefault(require("./notification.router"));
var _application = _interopRequireDefault(require("./application.router"));
const user = (0, _express.Router)();
user.use('/auth', _auth.default);
user.use('/profile', _profile.default);
user.use('/scores', _score.default);
user.use('/academic-scores', _academicScore.default);
user.use('/preferences', _preference.default);
user.use('/survey', _survey.default);
user.use('/payment', _payment.default);
user.use('/enrollment', _enrollment.default);
user.use('/notifications', _notification.default);
user.use('/applications', _application.default);
var _default = exports.default = user;