"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateAdmissionMethod = exports.getAdmissionMethodService = exports.getAdmissionMethodBySearch = exports.getAdmissionMethodByPages = exports.getAdmissionMethodByIdService = exports.deleteAdmissionMethod = exports.createAdmissionMethodService = void 0;
var _admissionMethod = _interopRequireDefault(require("../../models/admission-method"));
var _helpers = require("../../utils/helpers");
const createAdmissionMethodService = async data => {
  const {
    code,
    methodName,
    description,
    status
  } = data;
  const checkCode = await _admissionMethod.default.findOne({
    code
  });
  if (checkCode) {
    (0, _helpers.abort)(400, 'Mã tuyển sinh đã tồn tại');
  }
  const admissionMethod = await _admissionMethod.default.create({
    code,
    methodName,
    description,
    status
  });
  return admissionMethod;
};
exports.createAdmissionMethodService = createAdmissionMethodService;
const getAdmissionMethodService = async () => {
  const admissionMethod = await _admissionMethod.default.find();
  if (!admissionMethod) {
    (0, _helpers.abort)(400, 'không tồn tại phương thức tuyển sinh');
  }
  return admissionMethod;
};
exports.getAdmissionMethodService = getAdmissionMethodService;
const getAdmissionMethodByIdService = async id => {
  const admissionMethod = await _admissionMethod.default.findById(id);
  if (!admissionMethod) {
    (0, _helpers.abort)(400, 'không tồn tại phương thức tuyển sinh');
  }
  return admissionMethod;
};
exports.getAdmissionMethodByIdService = getAdmissionMethodByIdService;
const updateAdmissionMethod = async (id, data) => {
  const updateAdmission = await _admissionMethod.default.findByIdAndUpdate(id, data, {
    new: true
  });
  if (!updateAdmission) {
    (0, _helpers.abort)(400, 'không tìm thấy phương thức tuyển sinh');
  }
  return updateAdmission;
};
exports.updateAdmissionMethod = updateAdmissionMethod;
const deleteAdmissionMethod = async id => {
  const deleteData = await _admissionMethod.default.findOneAndDelete(id);
  if (!deleteData) {
    (0, _helpers.abort)(400, 'không tìm thấy phương thức tuyển sinh');
  }
  return deleteData;
};
exports.deleteAdmissionMethod = deleteAdmissionMethod;
const getAdmissionMethodBySearch = async data => {
  const {
    code,
    method,
    description,
    status
  } = data;
  const query = {};
  if (code) {
    query.code = {
      $regex: code,
      $options: 'i'
    };
  }
  if (method) {
    query.methodName = {
      $regex: method,
      $options: 'i'
    };
  }
  if (description) {
    query.description = {
      $regex: description,
      $options: 'i'
    };
  }
  if (status) {
    query.status = {
      $regex: status,
      $option: 'i'
    };
  }
  const search = await _admissionMethod.default.find(query);
  return search;
};
exports.getAdmissionMethodBySearch = getAdmissionMethodBySearch;
const getAdmissionMethodByPages = async data => {
  const {
    page = 1,
    limit = 10
  } = data;
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;
  const admissionMethod = await _admissionMethod.default.find().skip(skip).limit(limit);
  const total = await _admissionMethod.default.countDocuments();
  const totalPage = Math.ceil(total / limit);
  return {
    admissionMethod,
    total,
    page,
    limit,
    totalPage
  };
};
exports.getAdmissionMethodByPages = getAdmissionMethodByPages;