import {Router} from 'express'
import {asyncHandler} from '@/utils/helpers'
import validate from '@/app/middleware/user/validate'
import { globalAuth } from '@/app/middleware/globalAuth.middleware'
import * as authRequest from '@/app/requests/user/auth.request'
import * as authController from '@/app/controllers/user/auth.controller'

const authRouter = Router()

/**
 * @swagger
 * /user/auth/register:
 *   post:
 *     tags: [User Auth]
 *     summary: Đăng ký tài khoản người dùng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, phone, password, password_confirmation]
 *             properties:
 *               name: { type: string, example: "Nguyễn Văn A" }
 *               email: { type: string, example: "user@example.com" }
 *               phone: { type: string, example: "0912345678" }
 *               password: { type: string, minLength: 6, example: "Abc123456!" }
 *               password_confirmation: { type: string, example: "Abc123456!" }
 *     responses:
 *       200:
 *         description: Đăng ký thành công. Hệ thống đã gửi mã OTP xác thực vào email.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Lỗi dữ liệu đầu vào hoặc Email/Phone đã tồn tại.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *     summary: Đăng nhập bằng Email/Mật khẩu
 *     description: Sau khi gọi API này thành công, hệ thống sẽ gửi một mã OTP qua Email để hoàn tất đăng nhập.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "user@example.com" }
 *               password: { type: string, example: "Abc123456!" }
 *     responses:
 *       200:
 *         description: Đăng nhập bước 1 thành công. Vui lòng gọi API verify-login-otp.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Email hoặc mật khẩu không chính xác.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *     summary: Xác thực OTP để hoàn tất đăng nhập
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email: { type: string, example: "user@example.com" }
 *               otp: { type: string, example: "123456" }
 *     responses:
 *       200:
 *         description: Đăng nhập thành công. Trả về Token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 200 }
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/AuthToken' }
 *                 message: { type: string }
 *       400:
 *         description: Mã OTP không chính xác hoặc đã hết hạn.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *     summary: Xác thực OTP để kích hoạt tài khoản mới đăng ký
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email: { type: string, example: "user@example.com" }
 *               otp: { type: string, example: "123456" }
 *     responses:
 *       200:
 *         description: Tài khoản đã được kích hoạt thành công.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Mã OTP không chính xác hoặc tài khoản đã kích hoạt.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *     summary: Gửi lại mã OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, example: "user@example.com" }
 *     responses:
 *       200:
 *         description: Mã OTP mới đã được gửi vào Email.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
authRouter.post(
    '/resend-otp',
    asyncHandler(validate(authRequest.resendOtp)),
    asyncHandler(authController.resendOtp)
)

/**
 * @swagger
 * /user/auth/forgot-password:
 *   post:
 *     tags: [User Auth]
 *     summary: Yêu cầu quên mật khẩu
 *     description: Hệ thống sẽ gửi một mã OTP qua Email để xác thực việc đặt lại mật khẩu.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, example: "user@example.com" }
 *     responses:
 *       200:
 *         description: Mã OTP quên mật khẩu đã được gửi vào Email.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
authRouter.post(
    '/forgot-password',
    asyncHandler(validate(authRequest.forgotPassword)),
    asyncHandler(authController.forgotPassword)
)

/**
 * @swagger
 * /user/auth/verify-forgot-password-otp:
 *   post:
 *     tags: [User Auth]
 *     summary: Xác thực OTP quên mật khẩu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email: { type: string, example: "user@example.com" }
 *               otp: { type: string, example: "123456" }
 *     responses:
 *       200:
 *         description: Xác thực OTP thành công.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
authRouter.post(
    '/verify-forgot-password-otp',
    asyncHandler(validate(authRequest.verifyForgotPasswordOTP)),
    asyncHandler(authController.verifyForgotPasswordOTP)
)

/**
 * @swagger
 * /user/auth/reset-password:
 *   post:
 *     tags: [User Auth]
 *     summary: Đặt lại mật khẩu mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, password_confirmation]
 *             properties:
 *               email: { type: string, example: "user@example.com" }
 *               password: { type: string, minLength: 6, example: "NewPass123!" }
 *               password_confirmation: { type: string, example: "NewPass123!" }
 *     responses:
 *       200:
 *         description: Đặt lại mật khẩu thành công.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
authRouter.post(
    '/reset-password',
    asyncHandler(validate(authRequest.resetPassword)),
    asyncHandler(authController.resetPassword)
)

/**
 * @swagger
 * /user/auth/logout:
 *   post:
 *     tags: [User Auth]
 *     summary: Đăng xuất tài khoản
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Đăng xuất thành công. Token đã được vô hiệu hóa.
 *       401:
 *         description: Token không hợp lệ hoặc đã hết hạn.
 */
authRouter.post(
    '/logout',
    asyncHandler(globalAuth),
    asyncHandler(authController.logout)
)

/**
 * @swagger
 * /user/auth/refresh-token:
 *   post:
 *     tags: [User Auth]
 *     summary: Làm mới Access Token
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
 *         content:
 *           application/json:
 *             schema:
 *               data: { $ref: '#/components/schemas/AuthToken' }
 */
authRouter.post(
    '/refresh-token',
    asyncHandler(authController.refreshToken)
)

export default authRouter
