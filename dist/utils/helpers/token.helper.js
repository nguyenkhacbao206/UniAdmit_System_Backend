"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateToken = generateToken;
exports.getToken = getToken;
exports.verifyToken = verifyToken;
var _jsonwebtoken = _interopRequireWildcard(require("jsonwebtoken"));
var _lodash = _interopRequireDefault(require("lodash"));
var _assert = _interopRequireDefault(require("assert"));
var _configs = require("../../configs");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function generateToken(data, type, expiresIn, secretKey) {
  (0, _assert.default)(!_lodash.default.isNil(data), new TypeError('"data" is required.'));
  (0, _assert.default)(_lodash.default.isString(type) && !_lodash.default.isEmpty(type), new TypeError('"type" is required and must be a string.'));
  (0, _assert.default)(_lodash.default.isUndefined(secretKey) || _lodash.default.isString(secretKey) && !_lodash.default.isEmpty(secretKey), new TypeError('"secretKey" must be a string and cannot be empty.'));
  return _jsonwebtoken.default.sign({
    type,
    data
  }, secretKey ?? _configs.SECRET_KEY, {
    ...(!_lodash.default.isNil(expiresIn) && {
      expiresIn
    })
  });
}
function verifyToken(token, validType, secretKey) {
  (0, _assert.default)(_lodash.default.isString(token) && !_lodash.default.isEmpty(token), new TypeError('"token" is required and must be a string.'));
  (0, _assert.default)(_lodash.default.isString(validType) && !_lodash.default.isEmpty(validType), new TypeError('"validType" is required and must be a string.'));
  (0, _assert.default)(_lodash.default.isUndefined(secretKey) || _lodash.default.isString(secretKey) && !_lodash.default.isEmpty(secretKey), new TypeError('"secretKey" must be a string and cannot be empty.'));
  const {
    type,
    data
  } = _jsonwebtoken.default.verify(token, secretKey ?? _configs.SECRET_KEY);
  if (type !== validType) {
    throw new _jsonwebtoken.JsonWebTokenError();
  }
  return data;
}
function getToken(headers) {
  const token = headers.authorization;
  if (token) {
    const match = token.match(/Bearer\s*(.+)/);
    if (match && match.length > 1) {
      return match[1];
    }
  }
}