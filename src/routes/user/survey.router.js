import express from 'express'
import * as surveyController from '@/app/controllers/user/survey.controller'
import { asyncHandler } from '@/utils/helpers'
import { globalAuth } from '@/app/middleware/globalAuth.middleware'

const surveyRouter = express.Router()

surveyRouter.use(asyncHandler(globalAuth)) // Require login for all survey APIs

/**
 * @swagger
 * tags:
 *   name: User Survey
 *   description: APIs for users to take major suggestion surveys
 */

/**
 * @swagger
 * /user/survey/questions:
 *   get:
 *     tags: [User Survey]
 *     summary: Get list of published survey questions
 *     responses:
 *       200:
 *         description: Success
 */
surveyRouter.get(
    '/questions',
    asyncHandler(surveyController.getQuestions)
)

/**
 * @swagger
 * /user/survey/submit:
 *   post:
 *     tags: [User Survey]
 *     summary: Submit survey answers and get suggested major
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId:
 *                       type: string
 *                     optionId:
 *                       type: string
 *     responses:
 *       200:
 *         description: Suggested major result
 */
surveyRouter.post(
    '/submit',
    asyncHandler(surveyController.submitSurvey)
)

/**
 * @swagger
 * /user/survey/results:
 *   get:
 *     tags: [User Survey]
 *     summary: Get survey results history for the current user
 *     responses:
 *       200:
 *         description: List of past results
 */
surveyRouter.get(
    '/results',
    asyncHandler(surveyController.getResults)
)

export default surveyRouter
