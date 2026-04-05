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
        }
    },
    {
        timestamps: true
    }
)

export default preferenceSchema