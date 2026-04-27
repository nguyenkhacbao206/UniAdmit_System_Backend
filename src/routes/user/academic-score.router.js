import express from 'express'
import * as academicController from '@/app/controllers/user/academic-score.controller'
import * as academicRequest from '@/app/requests/user/academic-score.request'
import validate from '@/app/middleware/user/validate'
import { globalAuth } from '@/app/middleware/globalAuth.middleware'
import { asyncHandler } from '@/utils/helpers'

const router = express.Router()

router.use(asyncHandler(globalAuth))

/**
 * @swagger
 * /user/academic-scores:
 *   get:
 *     tags: [User Academic Scores]
 *     summary: Lấy toàn bộ điểm học bạ của người dùng hiện tại
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về dữ liệu học bạ.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/AcademicScore'
 */
router.get('/', asyncHandler(academicController.getMyAcademicScores))

/**
 * @swagger
 * /user/academic-scores/{semester}:
 *   put:
 *     tags: [User Academic Scores]
 *     summary: Cập nhật điểm cho một học kỳ cụ thể
 *     parameters:
 *       - in: path
 *         name: semester
 *         required: true
 *         schema:
 *           type: string
 *           enum: [hk1_lop10, hk2_lop10, hk1_lop11, hk2_lop11, hk1_lop12, hk2_lop12]
 *         description: Tên học kỳ
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
 *               literature: { type: number, example: 7.5 }
 *               english: { type: number, example: 9.0 }
 *               physics: { type: number, example: 8.0 }
 *               chemistry: { type: number, example: 7.0 }
 *               biology: { type: number, example: 8.0 }
 *               history: { type: number, example: 0 }
 *               geography: { type: number, example: 0 }
 *               civic_education: { type: number, example: 0 }
 *               conduct: { type: string, example: "Tốt" }
 *               academic_rank: { type: string, example: "Giỏi" }
 *     responses:
 *       200:
 *         description: Cập nhật thành công.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/AcademicScore'
 */
router.put('/:semester', 
    asyncHandler(validate(academicRequest.updateSemesterScore)), 
    asyncHandler(academicController.updateSemester)
)

export default router
