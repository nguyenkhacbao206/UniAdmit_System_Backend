import {Router} from 'express'
import {asyncHandler} from '@/utils/helpers'
import validate from '@/app/middleware/admin/validate'
import { globalAuth } from '@/app/middleware/globalAuth.middleware'
import * as authRequest from '@/app/requests/admin/auth.request'
import * as authController from '@/app/controllers/admin/auth.controller'

const authRouter = Router()

/**
 * @swagger
 * /admin/auth/login:
 *   post:
 *     tags: [Admin Auth]
 *     summary: Đăng nhập quản trị viên (Admin)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone, password]
 *             properties:
 *               phone: { type: string, example: "0987654321" }
 *               password: { type: string, example: "123456" }
 *     responses:
 *       200:
 *         description: Đăng nhập thành công. Trả về Token Admin.
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 data: { $ref: '#/components/schemas/AuthToken' }
 *       400:
 *         description: Số điện thoại hoặc mật khẩu không đúng.
 */
authRouter.post(
    '/login',
    asyncHandler(validate(authRequest.login)),
    asyncHandler(authController.login)
)

/**
 * @swagger
 * /admin/auth/logout:
 *   post:
 *     tags: [Admin Auth]
 *     summary: Đăng xuất quản trị viên
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Đăng xuất thành công.
 */
authRouter.post(
    '/logout',
    asyncHandler(globalAuth),
    asyncHandler(authController.logout)
)

/**
 * @swagger
 * /admin/auth/refresh-token:
 *   post:
 *     tags: [Admin Auth]
 *     summary: Làm mới Access Token cho Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refresh_token]
 *             properties:
 *               refresh_token: { type: string }
 *     responses:
 *       200:
 *         description: Cấp Token mới thành công.
 */
authRouter.post(
    '/refresh-token',
    asyncHandler(authController.refreshToken)
)

/**
 * @swagger
 * /admin/auth/me:
 *   get:
 *     tags: [Admin Auth]
 *     summary: Lấy thông tin tài khoản Admin hiện tại
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về thông tin chi tiết Admin và các quyền (Permissions).
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 data: { $ref: '#/components/schemas/Admin' }
 */
authRouter.get(
    '/me',
    asyncHandler(globalAuth),
    asyncHandler(authController.me)
)

export default authRouter
