import createModel, { ObjectId } from '@/models/base'

const UserSurveyResult = createModel(
    'UserSurveyResult',
    'user_survey_results',
    {
        userId: {
            type: ObjectId,
            required: true,
            ref: 'User'
        },

        // Summary of scores for each major
        majorScores: [{
            majorId: {
                type: ObjectId,
                ref: 'Major'
            },
            totalScore: {
                type: Number,
                default: 0
            }
        }],

        suggestedMajorId: {
            type: ObjectId,
            ref: 'Major'
        },

        matchPercentage: {
            type: Number,
            default: 0
        },

        answers: [{
            questionId: {
                type: ObjectId,
                ref: 'SurveyQuestion'
            },
            optionId: {
                type: ObjectId,
                ref: 'SurveyOption'
            }
        }]
    },
    {
        toJSON: { virtuals: true },
        virtuals: {
            suggestedMajor: {
                ref: 'Major',
                localField: 'suggestedMajorId',
                foreignField: '_id',
                justOne: true
            }
        }
    },
    {
        timestamp: true
    }
)

export default UserSurveyResult
