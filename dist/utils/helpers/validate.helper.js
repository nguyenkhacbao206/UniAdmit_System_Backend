"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tryValidateOrDefault = tryValidateOrDefault;
exports.validateAsync = validateAsync;
var _joi = _interopRequireDefault(require("joi"));
var _lodash = _interopRequireDefault(require("lodash"));
var _assert = _interopRequireDefault(require("assert"));
var _configs = require("../../configs");
var _classes = require("../classes");
async function validateAsync(schema, data, ...args) {
  (0, _assert.default)(_joi.default.isSchema(schema), new TypeError('"schema" must be a Joi schema.'));
  let errorDetails = {};
  async function dfs(variable) {
    if (variable instanceof _classes.AsyncValidate) {
      variable = await variable.exec(...args);
      if (variable?.prefs) {
        const property = variable.path.join('.');
        if (!(property in errorDetails)) {
          errorDetails[property] = `${variable}`;
        }
      }
    } else if (_lodash.default.isPlainObject(variable) || _lodash.default.isArray(variable)) {
      for (const key in variable) {
        if (_lodash.default.isObject(variable[key])) {
          variable[key] = await dfs(variable[key]);
        }
      }
    }
    return variable;
  }
  let {
    value,
    error
  } = schema.validate(data, {
    ..._configs.JOI_DEFAULT_OPTIONS,
    context: {
      data: _lodash.default.cloneDeep(data)
    }
  });
  if (error) {
    error = error.details.reduce(function (pre, curr) {
      const path = curr.path.join('.');
      if (!(path in pre)) {
        pre[path] = curr.message;
      }
      return pre;
    }, {});
    errorDetails = error;
  }
  value = await dfs(value);
  return [value, errorDetails];
}
function tryValidateOrDefault(...args) {
  const defaultValue = args.pop();
  return _joi.default.alternatives().try(...args, _joi.default.any().empty(_joi.default.any())).default(defaultValue);
}