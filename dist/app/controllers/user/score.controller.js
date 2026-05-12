"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.adminVerifyScore = adminVerifyScore;
exports.getMyScore = getMyScore;
exports.updateMyScore = updateMyScore;
var scoreService = _interopRequireWildcard(require("../../services/score.service"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
async function getMyScore(req, res) {
  const data = await scoreService.getScoreByUserId(req.currentUser._id);
  res.jsonify(data);
}
async function updateMyScore(req, res) {
  const data = await scoreService.updateOrCreateScore(req.currentUser._id, req.body);
  res.jsonify(data, 'Cập nhật điểm thi thành công. Đang chờ xác thực.');
}
async function adminVerifyScore(req, res) {
  const {
    user_id,
    verified
  } = req.body;
  const data = await scoreService.verifyScore(user_id, verified);
  res.jsonify(data, verified ? 'Đã xác thực bảng điểm' : 'Đã hủy xác thực bảng điểm');
}