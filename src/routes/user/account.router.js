import { Router } from 'express'
import * as accountController from '@/app/controllers/user/account.controller'
import { globalAuth } from '@/app/middleware/globalAuth.middleware'
import { asyncHandler } from '@/utils/helpers'

const router = Router()

// Mọi endpoint dưới /user/account đều yêu cầu đăng nhập.
router.use(asyncHandler(globalAuth))

// Bảo mật
router.post('/change-password', asyncHandler(accountController.changePassword))

// Thông báo + ngôn ngữ
router.get('/preferences', asyncHandler(accountController.getPreferences))
router.patch('/preferences', asyncHandler(accountController.updatePreferences))
router.patch('/language', asyncHandler(accountController.updateLanguage))

// Vô hiệu hóa / xóa
router.post('/disable', asyncHandler(accountController.disableAccount))
router.delete('/', asyncHandler(accountController.deleteAccount))

export default router
