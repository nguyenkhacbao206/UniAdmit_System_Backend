"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asyncHandler = asyncHandler;
exports.isAsyncFunction = isAsyncFunction;
var _lodash = _interopRequireDefault(require("lodash"));
var _assert = _interopRequireDefault(require("assert"));
function isAsyncFunction(v) {
  return _lodash.default.isFunction(v) && v.constructor && v.constructor.name === 'AsyncFunction';
}
function asyncHandler(fn) {
  (0, _assert.default)(isAsyncFunction(fn), new TypeError('"fn" is required and must be an async function.'));
  return function asyncUtilWrap(...args) {
    const fnReturn = fn(...args);
    const next = args[args.length - 1];
    return Promise.resolve(fnReturn).catch(next);
  };
}