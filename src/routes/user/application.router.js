import { Router } from 'express'
import * as applicationController from '@/app/controllers/user/application.controller'
import { asyncHandler } from '@/utils/helpers'
import { globalAuth } from '@/app/middleware/globalAuth.middleware'

const applicationRouter = Router()

applicationRouter.use(asyncHandler(globalAuth))

applicationRouter.post('/', asyncHandler(applicationController.create))
applicationRouter.get('/my', asyncHandler(applicationController.getMyApplications))
applicationRouter.get('/my-result', asyncHandler(applicationController.getMyResult))
applicationRouter.post('/confirm-admission', asyncHandler(applicationController.confirmAdmission))
applicationRouter.delete('/:id', asyncHandler(applicationController.deleteApplication))

export default applicationRouter
