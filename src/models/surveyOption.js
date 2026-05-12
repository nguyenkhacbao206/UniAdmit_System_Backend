import createModel, { ObjectId } from '@/models/base'

const SurveyOption = createModel(
    'SurveyOption',
    'survey_options',
    {
        questionId: {
            type: ObjectId,
            required: true,
            ref: 'SurveyQuestion'
        },

        content: {
            type: String,
            required: true,
        },

        // Mapping scores for majors
        // Example: [{ majorId: '...', score: 3 }]
        scores: [{
            majorId: {
                type: ObjectId,
                ref: 'Major',
                required: true
            },
            score: {
                type: Number,
                required: true,
                default: 0
            }
        }]
    },
    {
        toJSON: { virtuals: true }
    },
    {
        timestamp: true
    }
)

export default SurveyOption
