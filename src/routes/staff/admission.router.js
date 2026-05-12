import { Router } from 'express'
import * as admissionController from '@/app/controllers/staff/admission.controller'
import { asyncHandler } from '@/utils/helpers'
import { globalAuth } from '@/app/middleware/globalAuth.middleware'

const admissionRouter = Router()

admissionRouter.use(asyncHandler(globalAuth))

admissionRouter.get('/', asyncHandler(admissionController.getList))
admissionRouter.patch('/:id/verify', asyncHandler(admissionController.verify))
admissionRouter.patch('/:id/reject', asyncHandler(admissionController.reject))

export default admissionRouter
