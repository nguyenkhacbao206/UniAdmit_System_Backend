import { Router } from 'express'
import * as applicationController from '@/app/controllers/staff/application.controller'
import { asyncHandler } from '@/utils/helpers'
import { globalAuth } from '@/app/middleware/globalAuth.middleware'

const applicationRouter = Router()

applicationRouter.use(asyncHandler(globalAuth))

/**
 * @swagger
 * tags:
 *   name: Staff Application Management
 *   description: API for staff to manage student admission applications
 */

applicationRouter.get('/', asyncHandler(applicationController.getList))
applicationRouter.patch('/:id/status', asyncHandler(applicationController.updateStatus))

export default applicationRouter
