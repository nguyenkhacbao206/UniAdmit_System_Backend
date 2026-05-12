import createModel from './base'

const Round = createModel(
    'Round',
    'rounds',
    {
        code: {
            type: String,
            required: true,
            unique: true
        },

        name: {
            type: String,
            required: true
        },

        year: {
            type: Number,
            required: true
        },

        description: {
            type: String,
            default: ''
        },

        status: {
            type: String,
            enum: ['open', 'closed', 'processing', 'result_published'],
            default: 'open'
        },

        startDate: {
            type: Date,
            required: true
        },

        endDate: {
            type: Date,
            required: true
        },

        feePerPreference: {
            type: Number,
            default: 20000
        },

        serviceFee: {
            type: Number,
            default: 20000
        }
    },
    {
        timestamps: true
    }
)

export default Round
