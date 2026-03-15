import {Router} from 'express'
import {asyncHandler} from '@/utils/helpers'
import validate from '@/app/middleware/user/validate'
import * as authMiddleware from '@/app/middleware/user/auth.middleware'
import * as authRequest from '@/app/requests/user/auth.request'
import * as authController from '@/app/controllers/user/auth.controller'

const authRouter = Router()

/**
 * @swagger
 * /user/auth/register:
 *   post:
 *     tags: [User Auth]
 *     summary: User Register
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - password
 *               - password_confirmation
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nguyen Van A"
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               phone:
 *                 type: string
 *                 example: "0912345678"
 *               password:
 *                 type: string
 *                 example: "Password123!"
 *               password_confirmation:
 *                 type: string
 *                 example: "Password123!"
 *     responses:
 *       200:
 *         description: Register successful. OTP sent to email.
 */
authRouter.post(
    '/register',
    asyncHandler(validate(authRequest.register)),
    asyncHandler(authController.register)
)

/**
 * @swagger
 * /user/auth/login:
 *   post:
 *     tags: [User Auth]
 *     summary: User Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
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
 * /user/auth/verify-login-otp:
 *   post:
 *     tags: [User Auth]
 *     summary: User Verify Login OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
authRouter.post(
    '/verify-login-otp',
    asyncHandler(validate(authRequest.verifyOTP)),
    asyncHandler(authController.verifyLoginOTP)
)

/**
 * @swagger
 * /user/auth/verify-otp:
 *   post:
 *     tags: [User Auth]
 *     summary: User Verify Account OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified
 */
authRouter.post(
    '/verify-otp',
    asyncHandler(validate(authRequest.verifyOTP)),
    asyncHandler(authController.verifyOTP)
)

/**
 * @swagger
 * /user/auth/resend-otp:
 *   post:
 *     tags: [User Auth]
 *     summary: User Resend OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP resent
 */
authRouter.post(
    '/resend-otp',
    asyncHandler(validate(authRequest.resendOtp)),
    asyncHandler(authController.resendOtp)
)

/**
 * @swagger
 * /user/auth/logout:
 *   post:
 *     tags: [User Auth]
 *     summary: User Logout
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
 * /user/auth/refresh-token:
 *   post:
 *     tags: [User Auth]
 *     summary: User Refresh Token
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

export default authRouter
