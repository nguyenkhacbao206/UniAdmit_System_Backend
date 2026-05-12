import express from 'express'
import * as surveyController from '@/app/controllers/admin/survey.controller'
import { asyncHandler } from '@/utils/helpers'
import { globalAuth } from '@/app/middleware/globalAuth.middleware'
import { allowAccountTypes } from '@/app/middleware/permission'

const surveyRouter = express.Router()

// Only Admin can approve
surveyRouter.use(asyncHandler(globalAuth), asyncHandler(allowAccountTypes('admin')))

/**
 * @swagger
 * tags:
 *   name: Admin Survey
 *   description: APIs for admin to approve survey questions
 */

/**
 * @swagger
 * /admin/survey/questions/{id}/approve:
 *   patch:
 *     tags: [Admin Survey]
 *     summary: Approve a survey question to make it published
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Approved successfully
 */
surveyRouter.patch(
    '/questions/:id/approve',
    asyncHandler(surveyController.approveQuestion)
)

export default surveyRouter
