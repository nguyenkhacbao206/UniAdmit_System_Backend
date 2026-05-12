"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkAdmissionMethodId = void 0;
var _admissionMethod = require("../../services/admission-method.service");
const checkAdmissionMethodId = async (req, res, next) => {
  try {
    const {
      admissionMethodId
    } = req.params;
    const admissionMethod = await (0, _admissionMethod.getAdmissionMethodByIdService)(admissionMethodId);
    req.admissionMethod = admissionMethod;
    next();
  } catch (error) {
    res.jsonify(error.status || 500, error.message || 'Lỗi server');
  }
};
exports.checkAdmissionMethodId = checkAdmissionMethodId;