"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _configs = require("../configs");
function initLocalsHandler(req, res, next) {
  res.locals.APP_NAME = _configs.APP_NAME;
  res.locals.APP_URL_API = _configs.APP_URL_API;
  res.locals.APP_URL_CLIENT = _configs.APP_URL_CLIENT;
  res.locals.LINK_STATIC_URL = _configs.LINK_STATIC_URL;
  next();
}
var _default = exports.default = initLocalsHandler;