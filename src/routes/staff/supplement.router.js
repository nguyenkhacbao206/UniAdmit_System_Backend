import { Router } from 'express'
import * as supplementController from '@/app/controllers/staff/supplement.controller'
import { asyncHandler } from '@/utils/helpers'
import { globalAuth } from '@/app/middleware/globalAuth.middleware'

const supplementRouter = Router()

supplementRouter.use(asyncHandler(globalAuth))

// Lấy danh sách yêu cầu bổ sung
supplementRouter.get('/', asyncHandler(supplementController.getList))

// Tạo yêu cầu mới
supplementRouter.post('/', asyncHandler(supplementController.createRequest))

// Phê duyệt / Từ chối bổ sung
supplementRouter.post('/:id/action', asyncHandler(supplementController.handleAction))

export default supplementRouter
