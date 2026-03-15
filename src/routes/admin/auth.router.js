import {Router} from 'express'
import {asyncHandler} from '@/utils/helpers'
import validate from '@/app/middleware/admin/validate'
import * as authMiddleware from '@/app/middleware/admin/auth.middleware'
import * as authRequest from '@/app/requests/admin/auth.request'
import * as authController from '@/app/controllers/admin/auth.controller'

const authRouter = Router()

/**
 * @swagger
 * /admin/auth/login:
 *   post:
 *     tags: [Admin Auth]
 *     summary: Admin Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - phone
 *               - password
 *             properties:
 *               email:
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
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
 *     summary: Admin Logout
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
authRouter.post(
    '/logout',
    asyncHandler(authMiddleware.checkValidToken),
    asyncHandler(authController.logout)
)

/**
 * @swagger
 * /admin/auth/refresh-token:
 *   post:
 *     tags: [Admin Auth]
 *     summary: Admin Refresh Token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refresh_token
 *             properties:
 *               refresh_token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed
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
 *     summary: Get Current Admin Profile
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Admin profile data
 */
authRouter.get(
    '/me',
    asyncHandler(authMiddleware.checkValidToken),
    asyncHandler(authController.me)
)

export default authRouter
