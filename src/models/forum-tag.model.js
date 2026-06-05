import createModel from './base'

const ForumTag = createModel(
    'ForumTag',
    'forum_tags',
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            maxlength: 50,
        },
        color: {
            type: String,
            default: 'blue',
        },
        status: {
            type: String,
            enum: ['active', 'locked'],
            default: 'active',
        },
        description: {
            type: String,
            default: '',
        },
    }
)

export default ForumTag
