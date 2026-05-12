import express from 'express'
import * as surveyController from '@/app/controllers/staff/survey.controller'
import { asyncHandler } from '@/utils/helpers'
import { globalAuth } from '@/app/middleware/globalAuth.middleware'
import { allowAccountTypes } from '@/app/middleware/permission'

const surveyRouter = express.Router()

// Only Staff and Admin can access these routes
surveyRouter.use(asyncHandler(globalAuth), asyncHandler(allowAccountTypes('staff', 'admin')))

/**
 * @swagger
 * tags:
 *   name: Staff Survey
 *   description: APIs for staff to manage survey questions and options
 */

/**
 * @swagger
 * /staff/survey/questions:
 *   get:
 *     tags: [Staff Survey]
 *     summary: Get all survey questions for management
 *     responses:
 *       200:
 *         description: List of questions
 */
surveyRouter.get(
    '/questions',
    asyncHandler(surveyController.getQuestions)
)

/**
 * @swagger
 * /staff/survey/questions:
 *   post:
 *     tags: [Staff Survey]
 *     summary: Create a new survey question (pending status)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               order:
 *                 type: number
 *     responses:
 *       201:
 *         description: Created
 */
surveyRouter.post(
    '/questions',
    asyncHandler(surveyController.createQuestion)
)

/**
 * @swagger
 * /staff/survey/questions/{questionId}/options:
 *   post:
 *     tags: [Staff Survey]
 *     summary: Add an option with major score mapping to a question
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               scores:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     majorId:
 *                       type: string
 *                     score:
 *                       type: number
 *     responses:
 *       201:
 *         description: Created
 */
surveyRouter.post(
    '/questions/:questionId/options',
    asyncHandler(surveyController.addOption)
)

/**
 * @swagger
 * /staff/survey/questions/{id}:
 *   patch:
 *     tags: [Staff Survey]
 *     summary: Update a survey question
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Updated
 */
surveyRouter.patch(
    '/questions/:id',
    asyncHandler(surveyController.updateQuestion)
)

/**
 * @swagger
 * /staff/survey/questions/{id}:
 *   delete:
 *     tags: [Staff Survey]
 *     summary: Delete a survey question and its options
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 */
surveyRouter.delete(
    '/questions/:id',
    asyncHandler(surveyController.deleteQuestion)
)

/**
 * @swagger
 * /staff/survey/stats:
 *   get:
 *     tags: [Staff Survey]
 *     summary: Get survey statistics
 *     responses:
 *       200:
 *         description: Stats data
 */
surveyRouter.get(
    '/stats',
    asyncHandler(surveyController.getStats)
)

// Temporarily allow staff to approve for testing
surveyRouter.patch(
    '/questions/:id/approve',
    asyncHandler(surveyController.approveQuestion)
)

export default surveyRouter
