import mongoose from 'mongoose'
import createModel from './base'

const supplementSchema = createModel(
    'Supplement',
    'supplements',
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        staffId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff'
        },
        preferenceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Preference',
            required: true
        },
        code: {
            type: String,
            required: true,
            unique: true
        },
        type: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        deadline: {
            type: Date
        },
        userFeedback: {
            type: String,
            default: ''
        },
        attachments: {
            type: [String],
            default: []
        },
        status: {
            type: String,
            enum: ['pending', 'submitted', 'approved', 'rejected'],
            default: 'pending'
        },
        resubmittedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
)

export default supplementSchema
