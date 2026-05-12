"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkValidToken = checkValidToken;
var _helpers = require("../../../utils/helpers");
var _lodash = _interopRequireDefault(require("lodash"));
var _auth = require("../../services/auth.service");
var _configs = require("../../../configs");
var _models = require("../../../models");
var _jsonwebtoken = require("jsonwebtoken");
async function checkValidToken(req, res, next) {
  try {
    const token = (0, _helpers.getToken)(req.headers);
    if (token) {
      const allowedToken = _lodash.default.isUndefined(await _auth.tokenBlocklist.get(token));
      if (allowedToken) {
        const {
          userId
        } = (0, _helpers.verifyToken)(token, _configs.TOKEN_TYPE.USER_AUTHORIZATION);
        const user = await _models.User.findOne({
          _id: userId,
          deleted: false
        });
        if (user) {
          req.currentUser = user;
          next();
          return;
        }
      }
    }
  } catch (error) {
    if (!(error instanceof _jsonwebtoken.JsonWebTokenError)) {
      throw error;
    }
    if (error instanceof _jsonwebtoken.TokenExpiredError) {
      (0, _helpers.abort)(401, 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập để tiếp tục!');
    }
  }
  (0, _helpers.abort)(401);
}