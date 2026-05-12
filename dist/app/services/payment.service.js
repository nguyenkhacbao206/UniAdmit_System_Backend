"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _invoice = _interopRequireDefault(require("../../models/invoice.js"));
var _preference = _interopRequireDefault(require("../../models/preference.js"));
var _application = _interopRequireDefault(require("../../models/application.js"));
class PaymentService {
  async getInvoiceDetail(userId) {
    const paidInvoice = await _invoice.default.findOne({
      userId,
      status: 'paid'
    });
    if (paidInvoice) {
      return paidInvoice;
    }
    const applicationCount = await _application.default.countDocuments({
      user_id: userId
    });
    const preferenceCount = applicationCount > 0 ? applicationCount : (await _preference.default.find({
      userId
    })).length;
    if (preferenceCount === 0) {
      throw new Error('Bạn chưa đăng ký nguyện vọng nào.');
    }
    const FEE_PER_PREFERENCE = 20000;
    const SERVICE_FEE = 20000;
    const admissionFee = preferenceCount * FEE_PER_PREFERENCE;
    const serviceFee = SERVICE_FEE;
    const totalAmount = admissionFee + serviceFee;
    let invoice = await _invoice.default.findOne({
      userId,
      status: 'pending'
    });
    if (invoice) {
      if (invoice.preferenceCount !== preferenceCount) {
        invoice.preferenceCount = preferenceCount;
        invoice.admissionFee = admissionFee;
        invoice.serviceFee = serviceFee;
        invoice.totalAmount = totalAmount;
        await invoice.save();
      }
    } else {
      invoice = await _invoice.default.create({
        userId,
        preferenceCount,
        admissionFee,
        serviceFee,
        totalAmount,
        status: 'pending'
      });
    }
    return invoice;
  }
  async confirmPayment(userId, paymentMethod) {
    const invoice = await _invoice.default.findOne({
      userId,
      status: 'pending'
    });
    if (!invoice) {
      const paidInvoice = await _invoice.default.findOne({
        userId,
        status: 'paid'
      });
      if (paidInvoice) return paidInvoice;
      throw new Error('Không tìm thấy hóa đơn chưa thanh toán.');
    }
    invoice.status = 'paid';
    invoice.paymentMethod = paymentMethod || 'vnpay';
    invoice.transactionId = `TXN${new Date().getTime()}`;
    await invoice.save();
    return invoice;
  }
  async getPaymentStatus(userId) {
    const invoice = await _invoice.default.findOne({
      userId
    }).sort({
      createdAt: -1
    });
    if (!invoice) {
      return {
        status: 'unpaid',
        hasInvoice: false
      };
    }
    return {
      status: invoice.status === 'paid' ? 'paid' : 'unpaid',
      hasInvoice: true,
      invoice
    };
  }
  async getAllInvoices() {
    return await _invoice.default.find().populate('userId', 'name email phone').sort({
      createdAt: -1
    });
  }
}
var _default = exports.default = new PaymentService();