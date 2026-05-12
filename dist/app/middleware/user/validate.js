"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _joi = _interopRequireDefault(require("joi"));
var _lodash = _interopRequireDefault(require("lodash"));
var _assert = _interopRequireDefault(require("assert"));
var _helpers = require("../../../utils/helpers");
function validate(schema) {
  (0, _assert.default)(_joi.default.isSchema(schema), new TypeError('"schema" must be a Joi schema.'));
  return async function (req, res, next) {
    const field = req.method === 'GET' ? 'query' : 'body';
    const [value, error] = await (0, _helpers.validateAsync)(schema, req[field], req);
    if (!_lodash.default.isEmpty(error)) {
      (0, _helpers.abort)(400, error);
    }
    req[field] = value;
    next();
  };
}
var _default = exports.default = validate;