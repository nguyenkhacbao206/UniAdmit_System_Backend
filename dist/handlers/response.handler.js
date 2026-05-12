"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jsonify = jsonify;
exports.sendMail = sendMail;
var _assert = _interopRequireDefault(require("assert"));
var _lodash = _interopRequireDefault(require("lodash"));
var _statuses = _interopRequireDefault(require("statuses"));
var _ejs = _interopRequireDefault(require("ejs"));
var _configs = require("../configs");
var _path = _interopRequireDefault(require("path"));
var _helpers = require("../utils/helpers");
function jsonify(data, message) {
  const status = this.statusCode || 200;
  (0, _assert.default)(status >= 200 && status <= 300, new TypeError(`Invalid response status: ${status}. Please use success status code!`));
  if (_lodash.default.isString(data) && _lodash.default.isUndefined(message)) {
    [message, data] = [data, message];
  }
  (0, _assert.default)(_lodash.default.isNil(message) || _lodash.default.isString(message), new TypeError('"message" must be a string.'));
  const success = true;
  if (!_lodash.default.isString(message)) {
    message = _configs.STATUS_DEFAULT_MESSAGE[status] ?? (0, _statuses.default)(status);
  }
  return this.json({
    status,
    success,
    message,
    data
  });
}
function sendMail(to, subject, template, data, mailOptions) {
  _ejs.default.renderFile(_path.default.join(_configs.VIEW_DIR, template + '.ejs'), {
    ...this.locals,
    ...data
  }, function (err, html) {
    if (err) {
      const detail = (0, _helpers.normalizeError)(err);
      _configs.logger.error({
        message: 'Error rendering email template: ' + template,
        detail
      });
      return;
    }
    _configs.mailTransporter.sendMail({
      ...mailOptions,
      from: `"${_configs.MAIL_FROM_NAME}" <${_configs.MAIL_FROM_ADDRESS}>`,
      to,
      subject,
      html
    }, function (err) {
      if (!err) return;
      const detail = (0, _helpers.normalizeError)(err);
      _configs.logger.error({
        message: 'Error sending email to ' + to,
        detail
      });
    });
  });
}