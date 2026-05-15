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
        round_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Round',
            default: null
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
            enum: ['payos', 'vnpay', 'momo', 'bank_transfer', ''],
            default: ''
        },
        transactionId: {
            type: String,
            default: ''
        },
        orderCode: {
            type: Number,
            default: null,
            index: true
        },
        checkoutUrl: {
            type: String,
            default: ''
        },
        isSubmitted: {
            type: Boolean,
            default: false
        },
        submittedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
)

export default invoiceSchema
