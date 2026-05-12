import mongoose from 'mongoose'
import createModel from './base'

const preferenceSchema = createModel(
    'Preference',
    'preferences',
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        university: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'University',
            required: true
        },

        major: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Major',
            required: true
        },

        admissionMethod: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AdmissionMethod'
        },

        priority: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: ['pending', 'processing', 'approved', 'rejected', 'additional_required'],
            default: 'pending'
        },

        applicationCode: {
            type: String,
            unique: true,
            sparse: true
        },

        submittedAt: {
            type: Date,
            default: null
        },

        points: {
            type: Number,
            default: 0
        },

        combination: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: true
    }
)

export default preferenceSchema