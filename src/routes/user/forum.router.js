import { Router } from 'express'
import * as forumController from '@/app/controllers/user/forum.controller'
import validate from '@/app/middleware/user/validate'
import * as forumRequest from '@/app/requests/user/forum.request'
import { asyncHandler } from '@/utils/helpers'
import { globalAuth } from '@/app/middleware/globalAuth.middleware'

const router = Router()

// Public endpoints (sidebar widgets) — no auth required
router.get('/trending', asyncHandler(forumController.getTrending))
router.get('/tags', asyncHandler(forumController.getPopularTags))
router.get('/top-mentors', asyncHandler(forumController.getTopMentors))

// Auth required for everything else
router.use(asyncHandler(globalAuth))

// Posts
router.get(
    '/posts',
    asyncHandler(validate(forumRequest.listPosts)),
    asyncHandler(forumController.listPosts)
)
router.post(
    '/posts',
    asyncHandler(validate(forumRequest.createPost)),
    asyncHandler(forumController.createPost)
)
router.get('/posts/:id', asyncHandler(forumController.getPost))
router.put(
    '/posts/:id',
    asyncHandler(validate(forumRequest.updatePost)),
    asyncHandler(forumController.updatePost)
)
router.delete('/posts/:id', asyncHandler(forumController.deletePost))

router.post(
    '/posts/:id/vote',
    asyncHandler(validate(forumRequest.vote)),
    asyncHandler(forumController.votePost)
)
router.post('/posts/:id/bookmark', asyncHandler(forumController.toggleBookmark))
router.post(
    '/posts/:id/report',
    asyncHandler(validate(forumRequest.report)),
    asyncHandler(forumController.reportPost)
)
router.patch(
    '/posts/:id/resolve',
    asyncHandler(validate(forumRequest.resolve)),
    asyncHandler(forumController.markResolved)
)

// Comments (scoped to post)
router.get('/posts/:id/comments', asyncHandler(forumController.listComments))
router.post(
    '/posts/:id/comments',
    asyncHandler(validate(forumRequest.createComment)),
    asyncHandler(forumController.createComment)
)

// Comment operations
router.put(
    '/comments/:commentId',
    asyncHandler(validate(forumRequest.updateComment)),
    asyncHandler(forumController.updateComment)
)
router.delete('/comments/:commentId', asyncHandler(forumController.deleteComment))
router.post(
    '/comments/:commentId/vote',
    asyncHandler(validate(forumRequest.vote)),
    asyncHandler(forumController.voteComment)
)
router.patch(
    '/comments/:commentId/best-answer',
    asyncHandler(forumController.markBestAnswer)
)
router.post(
    '/comments/:commentId/report',
    asyncHandler(validate(forumRequest.report)),
    asyncHandler(forumController.reportComment)
)

export default router
