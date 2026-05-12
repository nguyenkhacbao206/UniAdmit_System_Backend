"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFileInfo = getFileInfo;
exports.upload = upload;
var _helpers = require("../../utils/helpers");
var _fileUpload = _interopRequireDefault(require("../../utils/classes/file-upload"));
async function upload(req, res) {
  const file = req.body.file;
  if (!file || !(file instanceof _fileUpload.default)) (0, _helpers.abort)(400, 'Vui lòng chọn file để tải lên');
  const scope = req.body.scope || 'others';
  const folder = scope.toLowerCase() + 's';
  const filePath = await file.save(folder);
  res.jsonify({
    url: filePath,
    filename: file.originalname,
    mimetype: file.mimetype,
    size: file.size
  }, 'Tải lên file thành công');
}
async function getFileInfo(req, res) {
  await Promise.resolve();
  res.jsonify({
    message: 'File info endpoint'
  });
}