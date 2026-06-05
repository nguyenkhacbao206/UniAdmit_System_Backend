import { Router } from 'express'
import * as dashboardController from '@/app/controllers/admin/dashboard.controller'
import { asyncHandler } from '@/utils/helpers'
import { globalAuth } from '@/app/middleware/globalAuth.middleware'

const router = Router()

router.use(asyncHandler(globalAuth))

router.get('/', asyncHandler(dashboardController.getOverview))

export default router
