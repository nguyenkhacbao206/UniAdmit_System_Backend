"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _moment = _interopRequireDefault(require("moment"));
var _yaml = _interopRequireDefault(require("yaml"));
var _winston = _interopRequireDefault(require("winston"));
var _assert = _interopRequireDefault(require("assert"));
var _chalk = _interopRequireDefault(require("chalk"));
var _lodash = _interopRequireDefault(require("lodash"));
var _constants = require("./constants");
const now = () => (0, _moment.default)().format('\\[YYYY-MM-DD HH:mm:ss\\]');
const wLogger = _winston.default.createLogger({
  format: _winston.default.format.printf(function (info) {
    const {
      level,
      message,
      ...data
    } = info;
    let msg = `${now()} ${_lodash.default.upperCase(level)}: ${message}`;
    if (!_lodash.default.isEmpty(data)) {
      msg += '\n' + _yaml.default.stringify(data);
    }
    return msg;
  })
});
const logger = {
  error({
    message,
    ...props
  }) {
    (0, _assert.default)(_lodash.default.isString(message), new TypeError('"message" must be a string.'));
    const {
      name,
      stack
    } = props;
    console.error(_chalk.default.redBright(now(), name ? `${name}:` : 'ERROR:', message));
    if (_lodash.default.isArray(stack) && !_lodash.default.isEmpty(stack)) {
      const stackStr = stack.map(s => '- ' + s).join('\n');
      console.error(_chalk.default.redBright(stackStr));
    } else if (_lodash.default.isString(stack)) {
      console.error(_chalk.default.redBright(stack));
    }
    if (!_constants.APP_DEBUG) {
      const fileLog = `node-${(0, _moment.default)().format('YYYY-MM-DD')}.log`;
      const [transport] = wLogger.transports;
      if (transport?.filename !== fileLog) {
        wLogger.configure({
          transports: new _winston.default.transports.File({
            filename: fileLog,
            dirname: _constants.LOG_DIR
          })
        });
      }
      return wLogger.error({
        message,
        ...props
      });
    }
  }
};
var _default = exports.default = logger;