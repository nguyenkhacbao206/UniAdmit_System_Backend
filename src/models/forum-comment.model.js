import createModel from './base'
import mongoose from 'mongoose'

const ForumComment = createModel(
    'ForumComment',
    'forum_comments',
    {
        post_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ForumPost',
            required: true,
        },
        author_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        author_type: {
            type: String,
            enum: ['User', 'Staff', 'Admin'],
            default: 'User',
        },
        content: {
            type: String,
            required: true,
        },
        upvotes: {
            type: Number,
            default: 0,
        },
        downvotes: {
            type: Number,
            default: 0,
        },
        parent_comment_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ForumComment',
            default: null,
        },
        is_best_answer: {
            type: Boolean,
            default: false,
        },
        deleted: {
            type: Boolean,
            default: false,
        }
    },

)

export default ForumComment