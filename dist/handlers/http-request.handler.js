"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _moment = _interopRequireDefault(require("moment"));
var _chalk = _interopRequireDefault(require("chalk"));
var _ms = _interopRequireDefault(require("ms"));
var _bytes = _interopRequireDefault(require("bytes"));
function httpRequestHandler(req, res, next) {
  const currentUrl = req.originalUrl;
  req._startTime = (0, _moment.default)();
  const end = res.end;
  res.end = function (...args) {
    let endTime = (0, _moment.default)();
    let processTime = endTime.diff(req._startTime, 'ms');
    res.end = end;
    res.end(...args);
    endTime = endTime.format('YYYY-MM-DD HH:mm:ss');
    processTime = (0, _ms.default)(processTime);
    const byteLength = (0, _bytes.default)(parseInt(res.get('content-length'), 10) || 0);
    const status = res.statusCode;
    const msg = `[${endTime}] ${req.method} ${currentUrl} ${status} - ${byteLength} - ${processTime}`;
    if (status < 400) {
      console.info(_chalk.default.green(msg));
    } else if (status < 500) {
      console.warn(_chalk.default.yellow(msg));
    } else {
      console.error(_chalk.default.red(msg));
    }
  };
  next();
}
var _default = exports.default = httpRequestHandler;