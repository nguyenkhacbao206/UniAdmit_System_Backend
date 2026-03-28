
import createModel, { ObjectId, STATUS_ACCOUNT } from './base'

const Major = createModel(
    'Major',
    'majors',
    {

        code: {
            type: String,
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        major: {
            type: String,
            required: true,
        },

        category: {
            type: String,
            required: true
        },

        university_id: {
            type: ObjectId,
            required: true,
        },

        quota: {
            type: Number,
            required: true
        },

        description: {
            type: String,
            default: ''
        },

        duration: {
            type: String,
            enum: ['4 năm', '5 năm', '6 năm', '7 năm', '8 năm'],
            default: '4 năm'
        },

        status: {
            type: String,
            enum: Object.values(STATUS_ACCOUNT),
            required: true,
            default: STATUS_ACCOUNT.ACTIVE,
        }

    },
    {
        toJSON: {
            virtuals: true,
            transform(doc, ret) {
                // eslint-disable-next-line no-unused-vars
                const { deleted, ...result } = ret
                return result
            },
        },
        virtuals: {
            university: {
                options: {
                    ref: 'University',
                    localField: 'university_id',
                    foreignField: '_id',
                },
            },
        },
    },
    {
        timestamp: true
    }
)

export default Major