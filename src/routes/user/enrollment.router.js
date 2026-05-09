import { Router } from 'express'
import * as enrollmentController from '@/app/controllers/user/enrollment.controller'
import { globalAuth } from '@/app/middleware/globalAuth.middleware'
import { allowAccountTypes } from '@/app/middleware/permission'
import { asyncHandler } from '@/utils/helpers'

const router = Router()

router.use(asyncHandler(globalAuth))
router.use(asyncHandler(allowAccountTypes('user')))

router.get('/summary', asyncHandler(enrollmentController.getSummary))
router.post('/submit', asyncHandler(enrollmentController.submitApplication))

export default router
