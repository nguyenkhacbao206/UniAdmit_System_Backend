import { Router } from 'express'
import * as forumCtrl from '@/app/controllers/admin/forum.controller'
import { asyncHandler } from '@/utils/helpers'
import { globalAuth } from '@/app/middleware/globalAuth.middleware'

const router = Router()
router.use(asyncHandler(globalAuth))

// Overview
router.get('/overview', asyncHandler(forumCtrl.getOverview))

// Settings
router.get('/settings', asyncHandler(forumCtrl.getSettings))
router.patch('/settings', asyncHandler(forumCtrl.updateSettings))

// Logs
router.get('/logs', asyncHandler(forumCtrl.listLogs))

// Tags
router.get('/tags', asyncHandler(forumCtrl.listTags))
router.post('/tags', asyncHandler(forumCtrl.createTag))
router.patch('/tags/:id', asyncHandler(forumCtrl.updateTag))
router.delete('/tags/:id', asyncHandler(forumCtrl.deleteTag))

// Moderation
router.get('/posts/pending', asyncHandler(forumCtrl.listPending))
router.get('/reports', asyncHandler(forumCtrl.listReported))
router.patch('/posts/:id/approve', asyncHandler(forumCtrl.approvePost))
router.patch('/posts/:id/reject', asyncHandler(forumCtrl.rejectPost))
router.delete('/posts/:id', asyncHandler(forumCtrl.deletePost))
router.delete('/comments/:id', asyncHandler(forumCtrl.deleteComment))
router.patch('/reports/:id/resolve', asyncHandler(forumCtrl.resolveReport))
router.patch('/reports/:id/dismiss', asyncHandler(forumCtrl.dismissReport))

export default router
