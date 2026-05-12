"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStatus = exports.getInvoice = exports.confirmPayment = void 0;
var _paymentService = _interopRequireDefault(require("../../services/payment.service.js"));
const getInvoice = async (req, res) => {
  try {
    const userId = req.currentUser._id;
    const {
      round_id
    } = req.query;
    const data = await _paymentService.default.getInvoiceDetail(userId, round_id);
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
exports.getInvoice = getInvoice;
const confirmPayment = async (req, res) => {
  try {
    const userId = req.currentUser._id;
    const {
      paymentMethod,
      round_id
    } = req.body;
    const data = await _paymentService.default.confirmPayment(userId, paymentMethod, round_id);
    res.json({
      success: true,
      message: 'Thanh toán thành công',
      data
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
exports.confirmPayment = confirmPayment;
const getStatus = async (req, res) => {
  try {
    const userId = req.currentUser._id;
    const {
      round_id
    } = req.query;
    const data = await _paymentService.default.getPaymentStatus(userId, round_id);
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
exports.getStatus = getStatus;