
import createModel from './base'

const Enrollment = createModel(
    'Enrollment',
    'enrollments',

    {
        code: {
            type: String,
            required: true
        },

        name: {
            type: String,
            required: true,
        },

        year: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: ['open', 'close'],
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
    },
    {
        timestamps: true
    }
)

export default Enrollment