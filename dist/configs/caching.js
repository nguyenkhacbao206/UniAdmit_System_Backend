"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _lodash = _interopRequireDefault(require("lodash"));
var _assert = _interopRequireDefault(require("assert"));
var _fileSystemCache = require("file-system-cache");
var _constants = require("./constants");
const cache = {
  create(namespace) {
    (0, _assert.default)(_lodash.default.isString(namespace) && !_lodash.default.isEmpty(namespace), new TypeError('"namespace" is required and must be a string.'));
    const fsCache = new _fileSystemCache.FileSystemCache({
      ns: namespace,
      basePath: _constants.CACHE_DIR,
      hash: 'sha256',
      extension: 'json'
    });
    return fsCache;
  }
};
var _default = exports.default = cache;