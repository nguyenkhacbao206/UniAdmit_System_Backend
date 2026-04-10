import { required } from 'joi'
import createModel from './base'
import { Timestamp } from 'firebase-admin/firestore'

const Staff = createModel(
    'Staff',
    'staffs',
    {
        code: {
            type: String,
        },

        name: {
            type: String,
            required: true
        },

        mail: {
            type: String,
            required: true
        },

        phone: {
            type: Number,
            required: true
        },

        password: {
            type: String,
            required: true
        },

        status: {
            type: String,
            required: true,
            enum: ['active', 'inactive']
        }
    },

    { Timestamp: true }

)

export default Staff