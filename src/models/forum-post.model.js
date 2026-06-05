import createModel from './base'
import mongoose from 'mongoose'

const ForumPost = createModel(
    'ForumPost',
    'forum_posts',
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 255,
        },
        content: {
            type: String,
            default: '',
        },

        tags: [
            {
                type: String,
                trim: true,
            },
        ],

        thumbnail: {
            type: String,
            default: '',
        },

        images: [
            {
                type: String,
                trim: true,
            },
        ],

        author_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        author_type: {
            type: String,
            enum: ['User', 'Staff', 'Admin'],
            default: 'User',
        },

        status: {
            type: String,
            enum: ['PENDING', 'APPROVED', 'REJECTED'],
            default: 'APPROVED',
        },

        is_resolved: {
            type: Boolean,
            default: false,
        },

        views: {
            type: Number,
            default: 0,
        },

        upvotes: {
            type: Number,
            default: 0,
        },

        downvotes: {
            type: Number,
            default: 0,
        },

        comments_count: {
            type: Number,
            default: 0,
        },

        deleted: {
            type: Boolean,
            default: false,
        }
    },

)

export default ForumPost