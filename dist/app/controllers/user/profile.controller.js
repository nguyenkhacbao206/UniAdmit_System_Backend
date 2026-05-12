"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProfile = getProfile;
exports.updateAvatar = updateAvatar;
exports.updateProfile = updateProfile;
exports.uploadCV = uploadCV;
exports.uploadDocument = uploadDocument;
var userService = _interopRequireWildcard(require("../../services/user.service"));
var _helpers = require("../../../utils/helpers");
var _fileUpload = _interopRequireDefault(require("../../../utils/classes/file-upload"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
async function getProfile(req, res) {
  const data = await userService.getUserProfile(req.currentUser._id);
  res.jsonify(data);
}
async function updateProfile(req, res) {
  if (req.body.avatar instanceof _fileUpload.default) {
    req.body.avatar = await req.body.avatar.save('avatars');
  }
  if (req.body.cv instanceof _fileUpload.default) {
    req.body.cv = await req.body.cv.save('cvs');
  }
  const updatedData = await userService.updateUserProfile(req.currentUser._id, req.body);
  res.jsonify(updatedData, 'Cập nhật thông tin thành công');
}
async function updateAvatar(req, res) {
  const file = req.body.file || req.body.avatar;
  if (!file || !(file instanceof _fileUpload.default)) (0, _helpers.abort)(400, 'Vui lòng chọn ảnh đại diện');
  if (!file.isImage()) (0, _helpers.abort)(400, 'File không đúng định dạng ảnh');
  const avatarPath = await file.save('avatars');
  const updatedAvatar = await userService.updateAvatar(req.currentUser._id, avatarPath);
  res.jsonify({
    avatar: updatedAvatar
  }, 'Cập nhật ảnh đại diện thành công');
}
async function uploadCV(req, res) {
  const file = req.body.file || req.body.cv;
  if (!file || !(file instanceof _fileUpload.default)) (0, _helpers.abort)(400, 'Vui lòng chọn file CV');
  const allowedMime = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (!allowedMime.includes(file.mimetype)) {
    (0, _helpers.abort)(400, 'File CV phải định dạng PDF hoặc Word');
  }
  const cvPath = await file.save('cvs');
  const updatedCV = await userService.updateCV(req.currentUser._id, cvPath);
  res.jsonify({
    cv: updatedCV
  }, 'Tải lên CV thành công');
}
async function uploadDocument(req, res) {
  const {
    field
  } = req.params;
  const allowedFields = ['cccd_doc', 'transcript_doc'];
  if (!allowedFields.includes(field)) (0, _helpers.abort)(400, 'Trường tài liệu không hợp lệ');
  const file = req.body.file || req.body[field];
  if (!file || !(file instanceof _fileUpload.default)) (0, _helpers.abort)(400, 'Vui lòng chọn file tài liệu');
  const allowedMime = ['application/pdf', 'image/jpeg', 'image/png'];
  if (!allowedMime.includes(file.mimetype)) {
    (0, _helpers.abort)(400, 'Định dạng file không hỗ trợ (chỉ nhận PDF, JPG, PNG)');
  }
  const filePath = await file.save('documents');
  const updatedPath = await userService.updateDocument(req.currentUser._id, field, filePath);
  res.jsonify({
    [field]: updatedPath
  }, 'Tải lên tài liệu thành công');
}