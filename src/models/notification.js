import mongoose from 'mongoose'
import createModel from './base'

const notificationSchema = createModel(
    'Notification',
    'notifications',
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            enum: ['additional_required', 'approved', 'rejected', 'system'],
            default: 'system'
        },
        read: {
            type: Boolean,
            default: false
        },
        metadata: {
            type: Object,
            default: {}
        }
    },
    {
        timestamps: true
    }
)

export default notificationSchema
