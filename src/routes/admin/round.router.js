import { Router } from 'express'
import * as roundController from '@/app/controllers/admin/round.controller'
import { asyncHandler } from '@/utils/helpers'
import { globalAuth } from '@/app/middleware/globalAuth.middleware'

const roundRouter = Router()

roundRouter.use(asyncHandler(globalAuth))

roundRouter.get('/', asyncHandler(roundController.getAll))
roundRouter.get('/page', asyncHandler(roundController.getByPage))
roundRouter.get('/:id', asyncHandler(roundController.getById))
roundRouter.post('/', asyncHandler(roundController.create))
roundRouter.put('/:id', asyncHandler(roundController.update))
roundRouter.patch('/:id/status', asyncHandler(roundController.updateStatus))
roundRouter.delete('/:id', asyncHandler(roundController.remove))

export default roundRouter
