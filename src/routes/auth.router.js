import { Router } from 'express'
import { asyncHandler } from '@/utils/helpers'
import validate from '@/app/middleware/admin/validate'
import * as authController from '@/app/controllers/user/auth.controller'
import * as globalAuthController from '@/app/controllers/auth.controller'
import * as authRequest from '@/app/requests/auth.request'
import { checkUniversalToken } from '@/app/middleware/auth'

const authRouter = Router()

/**
 * @swagger
 * /auth/google:
 *   get:
 *     tags: [Auth]
 *     summary: Login with Google
 *     description: Redirects to Google authentication page. After success, Google will call the callback URL.
 *     responses:
 *       302:
 *         description: Redirecting to Google Login
 */
authRouter.get(
    '/google',
    asyncHandler(authController.googleAuth)
)

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     tags: [Auth]
 *     summary: Google Login Callback
 *     description: Internal callback route. Google will redirect here. Then, this route will redirect to client with tokens in URL parameters.
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Authorization code from Google
 *     responses:
 *       302:
 *         description: Redirect to client success page with access_token, refresh_token and expire_in.
 */
authRouter.get(
    '/google/callback',
    asyncHandler(authController.googleCallback)
)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Universal Login for Users, Admins, and Staff. Identifier is email or phone.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identifier
 *               - password
 *             properties:
 *               identifier:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful. Returns roles dynamically.
 */
authRouter.post('/login', asyncHandler(validate(authRequest.loginUniversal)), asyncHandler(globalAuthController.loginUniversal))

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Universal Profile Data
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về thông tin Admin hoặc User tương ứng với Token
 */
authRouter.get('/me', asyncHandler(checkUniversalToken), asyncHandler(globalAuthController.meUniversal))

export default authRouter
