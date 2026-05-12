"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _lodash = _interopRequireDefault(require("lodash"));
var _classes = require("../utils/classes");
function formDataHandler(req, res, next) {
  const files = req.files;
  if (files) {
    for (let file of files) {
      const fieldname = file.fieldname;
      file = new _classes.FileUpload(file);
      if (_lodash.default.isUndefined(req.body[fieldname])) {
        req.body[fieldname] = file;
      } else {
        if (_lodash.default.isArray(req.body[fieldname])) {
          req.body[fieldname].push(file);
        } else {
          req.body[fieldname] = [req.body[fieldname], file];
        }
      }
    }
    delete req.files;
  }
  next();
}
var _default = exports.default = formDataHandler;