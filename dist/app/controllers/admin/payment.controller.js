"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllInvoices = void 0;
var _paymentService = _interopRequireDefault(require("../../services/payment.service.js"));
const getAllInvoices = async (req, res) => {
  try {
    const data = await _paymentService.default.getAllInvoices();
    res.json({
      success: true,
      data
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
exports.getAllInvoices = getAllInvoices;