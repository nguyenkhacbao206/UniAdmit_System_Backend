"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _lodash = _interopRequireDefault(require("lodash"));
var _assert = _interopRequireDefault(require("assert"));
class AsyncValidate {
  constructor(value, exec) {
    (0, _assert.default)(_lodash.default.isFunction(exec), new TypeError('"exec" is required and must be a function.'));
    this.value = value;
    this.exec = exec;
  }
  valueOf() {
    return this.value;
  }
  equals(other, comparator = _lodash.default.isEqual) {
    if (other instanceof AsyncValidate) {
      return comparator(this.value, other.value);
    }
    return false;
  }
}
var _default = exports.default = AsyncValidate;