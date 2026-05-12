"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _statuses = _interopRequireDefault(require("statuses"));
var _configs = require("../configs");
var _helpers = require("../utils/helpers");
function errorHandler(err, req, res, next) {
  if (err instanceof Error) {
    const success = false;
    let status = err.status || err.statusCode;
    if (status) {
      res.status(status).json({
        status,
        success,
        message: err.message,
        detail: err.detail
      });
      return;
    }
    const nError = (0, _helpers.normalizeError)(err);
    _configs.logger.error({
      ...nError,
      request: {
        method: req.method,
        originalUrl: req.originalUrl,
        headers: req.headers,
        body: req.body
      }
    });
    status = 500;
    const message = _configs.STATUS_DEFAULT_MESSAGE[status] ?? (0, _statuses.default)(status);
    res.status(status).json({
      status,
      success,
      message
    });
    return;
  }
  res.sendStatus(500);
  next(err);
}
var _default = exports.default = errorHandler;