import createModel from './base'
import mongoose from 'mongoose'

const ForumVote = createModel(
    'ForumVote',
    'forum_votes',
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        comment_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ForumComment',
            default: null,
        },
        post_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ForumPost',
            default: null,
        },
        vote: {
            type: Number,
            required: true,
        },
    },
)

export default ForumVote