import { Router } from 'express'
import * as enrollmentController from '@/app/controllers/user/enrollment.controller'
import { asyncHandler } from '@/utils/helpers'
import { globalAuth } from '@/app/middleware/globalAuth.middleware'

const enrollmentRouter = Router()

enrollmentRouter.use(asyncHandler(globalAuth))

enrollmentRouter.get('/summary', asyncHandler(enrollmentController.getSummary))
enrollmentRouter.post('/submit', asyncHandler(enrollmentController.submit))

export default enrollmentRouter
