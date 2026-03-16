import {Router} from 'express'
import {asyncHandler} from '@/utils/helpers'
import * as authController from '@/app/controllers/user/auth.controller'

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

export default authRouter
