import { Router } from 'express'
import * as fileController from '@/app/controllers/file.controller'
import { asyncHandler } from '@/utils/helpers'
import { globalAuth } from '@/app/middleware/globalAuth.middleware'

const fileRouter = Router()

// Yêu cầu đăng nhập để upload file
fileRouter.use(asyncHandler(globalAuth))

fileRouter.post('/', asyncHandler(fileController.upload))
fileRouter.get('/:id/info', asyncHandler(fileController.getFileInfo))

export default fileRouter
