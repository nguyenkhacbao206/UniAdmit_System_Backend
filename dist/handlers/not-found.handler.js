"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _helpers = require("../utils/helpers");
function notFoundHandler() {
  (0, _helpers.abort)(404);
}
var _default = exports.default = notFoundHandler;