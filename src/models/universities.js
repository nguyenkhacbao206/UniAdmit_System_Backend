import createModel from './base'

const University = createModel(
    'University',
    'universities',
    {
        code: {
            type: String,
            required: true,
            unique: true,
        },

        name: {
            type: String,
            required: true,
        },

        location: {
            type: String,
        },

        majors: {
            type: Number
        },

        status: {
            type: String,
            default: "active"  // active | inactive
        }
    },
    {
        timestamps: true
    }
)

export default University
