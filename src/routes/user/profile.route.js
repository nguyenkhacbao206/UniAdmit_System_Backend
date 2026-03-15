import express from 'express'
import * as profileController from '@/app/controllers/user/profile.controller'
import validate from '@/app/middleware/user/validate'
import * as profileRequest from '@/app/requests/user/profile.request'
import { checkValidToken } from '@/app/middleware/user/auth.middleware'
import { asyncHandler } from '@/utils/helpers'

const router = express.Router()

router.use(asyncHandler(checkValidToken))

/**
 * @swagger
 * /user/profile:
 *   get:
 *     tags: [User Profile]
 *     summary: Lấy thông tin hồ sơ cá nhân
 *     description: Lấy toàn bộ thông tin tài khoản (User) và thông tin hồ sơ chi tiết (Profile) của người dùng đang đăng nhập.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về dữ liệu hồ sơ thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 200 }
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/User'
 *                     - type: object
 *                       properties:
 *                         profile: { $ref: '#/components/schemas/ProfileDetail' }
 *       401:
 *         description: Token không hợp lệ hoặc đã hết hạn.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', asyncHandler(profileController.getProfile))

/**
 * @swagger
 * /user/profile:
 *   put:
 *     tags: [User Profile]
 *     summary: Cập nhật thông tin hồ sơ
 *     description: Cập nhật các trường thông tin cơ bản và thông tin chi tiết. Chỉ gửi những trường cần thay đổi.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: "Nguyễn Văn A" }
 *               email: { type: string, example: "user@example.com" }
 *               phone: { type: string, example: "0912345678" }
 *               gender: { type: string, enum: [male, female, other], example: "male" }
 *               dob: { type: string, format: date, example: "1995-10-25" }
 *               ethnicity: { type: string, example: "Kinh" }
 *               permanentAddress: { type: string, example: "Địa chỉ thường trú" }
 *               contactAddress: { type: string, example: "Địa chỉ liên lạc" }
 *               cccd: { type: string, example: "031095001234" }
 *               place_of_issue: { type: string, example: "Cục Cảnh sát QLHC về TTXH" }
 *               avatar: { type: string, format: binary, description: "Ảnh đại diện (File)" }
 *               cv: { type: string, format: binary, description: "Hồ sơ năng lực (File PDF/Word)" }
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: "Nguyễn Văn A" }
 *               email: { type: string, example: "user@example.com" }
 *               phone: { type: string, example: "0912345678" }
 *               gender: { type: string, enum: [male, female, other], example: "male" }
 *               dob: { type: string, format: date, example: "1995-10-25" }
 *               ethnicity: { type: string, example: "Kinh" }
 *               permanentAddress: { type: string, example: "Địa chỉ thường trú" }
 *               contactAddress: { type: string, example: "Địa chỉ liên lạc" }
 *               cccd: { type: string, example: "031095001234" }
 *               place_of_issue: { type: string, example: "Cục Cảnh sát QLHC về TTXH" }
 *     responses:
 *       200:
 *         description: Cập nhật thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 200 }
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/User'
 *                     - type: object
 *                       properties:
 *                         profile: { $ref: '#/components/schemas/ProfileDetail' }
 *                 message: { type: string, example: "Cập nhật thông tin thành công" }
 *       400:
 *         description: Dữ liệu không hợp lệ (Email/Phone đã tồn tại hoặc sai định dạng).
 */
router.put('/', asyncHandler(validate(profileRequest.updateProfile)), asyncHandler(profileController.updateProfile))

/**
 * @swagger
 * /user/profile/avatar:
 *   patch:
 *     tags: [User Profile]
 *     summary: Cập nhật ảnh đại diện
 *     description: Tải lên một file ảnh mới (JPEG, PNG, WEBP). Hệ thống sẽ tự động tối ưu hóa và nén ảnh.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File ảnh đại diện.
 *     responses:
 *       200:
 *         description: Cập nhật ảnh đại diện thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 200 }
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     avatar: { type: string, example: "uploads/avatars/uuid.webp" }
 *                 message: { type: string, example: "Cập nhật ảnh đại diện thành công" }
 */
router.patch('/avatar', asyncHandler(profileController.updateAvatar))

/**
 * @swagger
 * /user/profile/cv:
 *   post:
 *     tags: [User Profile]
 *     summary: Tải lên CV (Hồ sơ năng lực)
 *     description: Chấp nhận các định dạng file PDF, DOC, DOCX. Dung lượng tối đa 5MB.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File CV (PDF/Word).
 *     responses:
 *       200:
 *         description: Tải lên CV thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 200 }
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     cv: { type: string, example: "uploads/cvs/uuid.pdf" }
 *                 message: { type: string, example: "Tải lên CV thành công" }
 */
router.post('/cv', asyncHandler(profileController.uploadCV))

export default router
