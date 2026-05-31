import createModel from './base'
import mongoose from 'mongoose'

const ForumBookmark = createModel(
    'ForumBookmark',
    'forum_bookmarks',
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        post_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ForumPost',
            required: true,
            index: true,
        },
    },
)

export default ForumBookmark
