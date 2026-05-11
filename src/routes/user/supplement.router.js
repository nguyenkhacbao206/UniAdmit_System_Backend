import { Router } from 'express'
import * as supplementController from '@/app/controllers/user/supplement.controller'
import { asyncHandler } from '@/utils/helpers'
import { globalAuth } from '@/app/middleware/globalAuth.middleware'

const supplementRouter = Router()

supplementRouter.use(asyncHandler(globalAuth))

// Lấy danh sách yêu cầu của tôi
supplementRouter.get('/my-requests', asyncHandler(supplementController.getMyRequests))

// Nộp phản hồi
supplementRouter.post('/:id/submit', asyncHandler(supplementController.submitResponse))

export default supplementRouter
