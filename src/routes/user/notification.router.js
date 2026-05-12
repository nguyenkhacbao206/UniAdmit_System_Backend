import { Router } from 'express'
import * as notificationController from '@/app/controllers/user/notification.controller'
import { asyncHandler } from '@/utils/helpers'
import { globalAuth } from '@/app/middleware/globalAuth.middleware'

const notificationRouter = Router()

// SSE route phải đứng TRƯỚC globalAuth vì nó tự xác thực qua query token
notificationRouter.get('/sse', notificationController.sseStream)

// Các route còn lại yêu cầu auth
notificationRouter.use(asyncHandler(globalAuth))

notificationRouter.get('/', asyncHandler(notificationController.getNotifications))
notificationRouter.patch('/read-all', asyncHandler(notificationController.markAllRead))
notificationRouter.patch('/:id/read', asyncHandler(notificationController.markRead))

export default notificationRouter
