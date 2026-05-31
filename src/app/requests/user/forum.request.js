import Joi from 'joi'

export const createPost = Joi.object({
    title: Joi.string().trim().min(1).max(255).required().label('Tiêu đề'),
    content: Joi.string().allow('', null).default('').label('Nội dung'),
    tags: Joi.array().items(Joi.string().trim().max(30)).max(10).default([]).label('Tags'),
    thumbnail: Joi.string().max(500).allow('', null).label('Ảnh đại diện'),
    images: Joi.array().items(Joi.string().max(500)).max(10).default([]).label('Ảnh đính kèm'),
})

export const updatePost = Joi.object({
    title: Joi.string().trim().min(1).max(255).label('Tiêu đề'),
    content: Joi.string().allow('', null).label('Nội dung'),
    tags: Joi.array().items(Joi.string().trim().max(30)).max(10).label('Tags'),
    thumbnail: Joi.string().max(500).allow('', null).label('Ảnh đại diện'),
    images: Joi.array().items(Joi.string().max(500)).max(10).label('Ảnh đính kèm'),
})

export const listPosts = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
    search: Joi.string().allow('').default(''),
    sort: Joi.string().valid('latest', 'trending', 'most_viewed').default('latest'),
    tag: Joi.string().allow('').default(''),
    unanswered: Joi.boolean().default(false),
    bookmarked: Joi.boolean().default(false),
})

export const vote = Joi.object({
    vote: Joi.number().valid(-1, 0, 1).required().label('Vote'),
})

export const report = Joi.object({
    reason: Joi.string().valid('spam', 'toxic', 'misinfo', 'other').required().label('Lý do'),
    details: Joi.string().max(1000).allow('', null).label('Chi tiết'),
})

export const resolve = Joi.object({
    is_resolved: Joi.boolean().required().label('Trạng thái'),
})

export const createComment = Joi.object({
    content: Joi.string().trim().min(1).max(5000).required().label('Nội dung'),
    parent_comment_id: Joi.string().hex().length(24).allow(null, '').label('Bình luận cha'),
})

export const updateComment = Joi.object({
    content: Joi.string().trim().min(1).max(5000).required().label('Nội dung'),
})
