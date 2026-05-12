import { Router } from 'express'
import * as admissionController from '@/app/controllers/admin/admission.controller'
import { asyncHandler } from '@/utils/helpers'
import { globalAuth } from '@/app/middleware/globalAuth.middleware'

const admissionRouter = Router()

admissionRouter.use(asyncHandler(globalAuth))

admissionRouter.post('/run', asyncHandler(admissionController.runAdmission))
admissionRouter.post('/publish', asyncHandler(admissionController.publishResult))
admissionRouter.get('/statistics', asyncHandler(admissionController.getStatistics))

export default admissionRouter
