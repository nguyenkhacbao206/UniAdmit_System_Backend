"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.abort = abort;
exports.normalizeError = normalizeError;
var _lodash = _interopRequireDefault(require("lodash"));
var _assert = _interopRequireDefault(require("assert"));
var _path = _interopRequireDefault(require("path"));
var _statuses = _interopRequireDefault(require("statuses"));
var _configs = require("../../configs");
const NODE_MODULES_DIR = _path.default.join(_configs.APP_DIR, 'node_modules');
function normalizeError(error) {
  (0, _assert.default)(_lodash.default.isError(error), new TypeError('"error" is required and must be an error.'));
  const re = new RegExp(_lodash.default.escapeRegExp(_configs.APP_DIR) + '.*?$', 'gm');
  let stack = error.stack ? error.stack.match(re) : error.stack;
  if (_lodash.default.isArray(stack)) {
    stack = stack.map(s => s.trim()).map(s => s.endsWith(')') ? s.slice(0, -1) : s).filter(s => !s.startsWith(NODE_MODULES_DIR));
  }
  return {
    name: error.name || 'Error',
    message: error.message || `${error}`,
    stack
  };
}
function abort(statusCode, message, detail) {
  const msg = (0, _statuses.default)(statusCode);
  (0, _assert.default)(statusCode >= 400, new TypeError(`Invalid response status: ${statusCode}. Please use error status code!`));
  if (_lodash.default.isObject(message) && _lodash.default.isUndefined(detail)) {
    [detail, message] = [message, detail];
  }
  (0, _assert.default)(_lodash.default.isNil(message) || _lodash.default.isString(message), new TypeError('"message" must be a string.'));
  if (!_lodash.default.isString(message)) {
    message = _configs.STATUS_DEFAULT_MESSAGE[statusCode] ?? msg;
  }
  const error = new Error(message);
  error.status = statusCode;
  error.detail = detail;
  throw error;
}