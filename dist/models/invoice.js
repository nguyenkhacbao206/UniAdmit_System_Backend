"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var _base = _interopRequireDefault(require("./base"));
const invoiceSchema = (0, _base.default)('Invoice', 'invoices', {
  userId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  admissionFee: {
    type: Number,
    required: true,
    default: 0
  },
  serviceFee: {
    type: Number,
    required: true,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 0
  },
  preferenceCount: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['vnpay', 'momo', 'bank_transfer', ''],
    default: ''
  },
  transactionId: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});
var _default = exports.default = invoiceSchema;