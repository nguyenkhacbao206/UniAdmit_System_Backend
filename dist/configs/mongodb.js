"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var _constants = require("./constants");
const mongoDb = {
  connect() {
    return _mongoose.default.connect(_constants.DATABASE_URI, {
      dbName: _constants.DB_NAME,
      user: _constants.DB_USERNAME,
      pass: _constants.DB_PASSWORD,
      authSource: _constants.DB_AUTH_SOURCE,
      autoCreate: true,
      autoIndex: true,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      serverSelectionTimeoutMS: 30000
    });
  },
  close(force) {
    return _mongoose.default.connection.close(force);
  },
  transaction(...args) {
    return _mongoose.default.connection.transaction(...args);
  },
  isDisconnected() {
    return _mongoose.default.connection.readyState === 0;
  }
};
var _default = exports.default = mongoDb;