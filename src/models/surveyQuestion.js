import createModel, { ObjectId } from '@/models/base'

const SurveyQuestion = createModel(
    'SurveyQuestion',
    'survey_questions',
    {
        content: {
            type: String,
            required: true,
        },
        
        status: {
            type: String,
            enum: ['pending', 'published', 'disabled'],
            default: 'pending',
        },

        createdBy: {
            type: ObjectId,
            required: true,
            ref: 'User'
        },

        order: {
            type: Number,
            default: 0
        }
    },
    {
        toJSON: { virtuals: true },
        virtuals: {
            options: {
                ref: 'SurveyOption',
                localField: '_id',
                foreignField: 'questionId',
            },
        },
    },
    {
        timestamp: true
    }
)

export default SurveyQuestion
