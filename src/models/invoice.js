import mongoose from 'mongoose'
import createModel from './base'

const invoiceSchema = createModel(
    'Invoice',
    'invoices',
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
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
    },
    {
        timestamps: true
    }
)

export default invoiceSchema
