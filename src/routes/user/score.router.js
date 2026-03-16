import express from 'express'
import * as scoreController from '@/app/controllers/user/score.controller'
import * as scoreRequest from '@/app/requests/user/score.request'
import validate from '@/app/middleware/user/validate'
import { checkValidToken } from '@/app/middleware/user/auth.middleware'
import { asyncHandler } from '@/utils/helpers'

const router = express.Router()

// Tất cả các route yêu cầu đăng nhập
router.use(asyncHandler(checkValidToken))

/**
 * @swagger
 * /user/scores:
 *   get:
 *     tags: [User Scores]
 *     summary: Lấy bảng điểm thi THPT của người dùng hiện tại
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về bảng điểm thành công.
 */
router.get('/', asyncHandler(scoreController.getMyScore))

/**
 * @swagger
 * /user/scores:
 *   put:
 *     tags: [User Scores]
 *     summary: Cập nhật hoặc tạo mới bảng điểm thi THPT
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               math: { type: number, example: 8.5 }
 *               literature: { type: number, example: 7.0 }
 *               english: { type: number, example: 9.0 }
 *               physics: { type: number, example: 8.0 }
 *               chemistry: { type: number, example: 7.5 }
 *               biology: { type: number, example: 6.5 }
 *               history: { type: number, example: 0 }
 *               geography: { type: number, example: 0 }
 *               civic_education: { type: number, example: 0 }
 *     responses:
 *       200:
 *         description: Cập nhật thành công.
 */
router.put('/', 
    asyncHandler(validate(scoreRequest.updateScore)), 
    asyncHandler(scoreController.updateMyScore)
)

/**
 * @swagger
 * /user/scores/verify:
 *   patch:
 *     tags: [User Scores]
 *     summary: Admin xác thực bảng điểm (Cần quyền Admin)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user_id, verified]
 *             properties:
 *               user_id: { type: string, example: "user_id_here" }
 *               verified: { type: boolean, example: true }
 *     responses:
 *       200:
 *         description: Xác thực thành công.
 */
router.patch('/verify', 
    asyncHandler(validate(scoreRequest.verifyScore)), 
    asyncHandler(scoreController.adminVerifyScore)
)

export default router
