import createModel from './base'
import mongoose from 'mongoose'

const ForumReport = createModel(
    'ForumReport',
    'forum_reports',
    {
        post_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ForumPost',
            default: null,
        },
        comment_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ForumComment',
            default: null,
        },
        reporter_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        reason: {
            type: String,
            enum: ['spam', 'toxic', 'misinfo', 'other'],
            required: true,
        },
        details: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            enum: ['PENDING', 'RESOLVED', 'DISMISSED'],
            default: 'PENDING',
        },
    },
)

export default ForumReport
