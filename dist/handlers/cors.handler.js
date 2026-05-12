"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.corsOptions = void 0;
var _cors = _interopRequireDefault(require("cors"));
var _configs = require("../configs");
const corsOptions = exports.corsOptions = {
  origin: [_configs.APP_URL_CLIENT, ..._configs.OTHER_URLS_CLIENT],
  credentials: true
};
const corsHandler = (0, _cors.default)(corsOptions);
var _default = exports.default = corsHandler;