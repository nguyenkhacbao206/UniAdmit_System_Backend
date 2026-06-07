import createModel from './base'

// Singleton-style settings document. Only one row is ever expected, keyed by scope='forum'.
const ForumSetting = createModel(
    'ForumSetting',
    'forum_settings',
    {
        scope: {
            type: String,
            default: 'forum',
            unique: true,
            index: true,
        },
        autoApproveMentors: {
            type: Boolean,
            default: true,
        },
        // When true (default), every post by a regular User goes to PENDING
        // and must be approved by staff before it appears on the forum.
        requireUserApproval: {
            type: Boolean,
            default: true,
        },
        toxicAction: {
            type: String,
            enum: ['hide', 'delete', 'censor'],
            default: 'hide',
        },
        maxPostsPerDay: {
            type: Number,
            default: 5,
            min: 1,
            max: 100,
        },
        maxCommentsPerDay: {
            type: Number,
            default: 50,
            min: 1,
            max: 1000,
        },
        bannedWords: [
            {
                type: String,
                trim: true,
                lowercase: true,
            },
        ],
    }
)

export default ForumSetting
