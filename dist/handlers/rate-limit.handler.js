"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _expressRateLimit = require("express-rate-limit");
var _configs = require("../configs");
var _helpers = require("../utils/helpers");
const limiter = (0, _expressRateLimit.rateLimit)({
  windowMs: 1 * 60 * 1000,
  max: _configs.REQUESTS_LIMIT_PER_MINUTE,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: () => (0, _helpers.abort)(429)
});
var _default = exports.default = limiter;