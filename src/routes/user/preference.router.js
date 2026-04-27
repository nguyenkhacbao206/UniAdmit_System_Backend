import * as preferenceController from '@/app/controllers/user/preference.controller.js'
import * as preferenceRequest from '@/app/requests/user/preference.request.js'
import * as preferenceMiddleware from '@/app/middleware/user/preference.middleware.js'
import { globalAuth } from '@/app/middleware/globalAuth.middleware.js'
import validate from '@/app/middleware/user/validate.js'
import {asyncHandler} from '@/utils/helpers'
import {Router} from 'express'

const preferenceRouter = Router()

/**
 * @swagger
 * tags:
 *   name: User Preference
 *   description: Management of user admission preferences
 */

preferenceRouter.use(asyncHandler(globalAuth))

/**
 * @swagger
 * /user/preferences:
 *   get:
 *     tags: [User Preference]
 *     summary: Get all preferences of user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of preferences
 */
preferenceRouter.get(
    '/',
    asyncHandler(preferenceController.getList)
)

/**
 * @swagger
 * /user/preferences:
 *   post:
 *     tags: [User Preference]
 *     summary: Add new preference
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - university
 *               - major
 *             properties:
 *               university:
 *                 type: string
 *               major:
 *                 type: string
 *               admissionMethod:
 *                 type: string
 *     responses:
 *       200:
 *         description: Added successfully
 */
preferenceRouter.post(
    '/',
    asyncHandler(validate(preferenceRequest.add)),
    asyncHandler(preferenceController.add)
)

/**
 * @swagger
 * /user/preferences/reorder:
 *   patch:
 *     tags: [User Preference]
 *     summary: Reorder preferences
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               list:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     priority:
 *                       type: number
 *     responses:
 *       200:
 *         description: Reordered successfully
 */
preferenceRouter.patch(
    '/reorder',
    asyncHandler(validate(preferenceRequest.reorder)),
    asyncHandler(preferenceController.reorder)
)

/**
 * @swagger
 * /user/preferences/confirm:
 *   post:
 *     tags: [User Preference]
 *     summary: Confirm preferences
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Confirmed successfully
 */
preferenceRouter.post(
    '/confirm',
    asyncHandler(preferenceController.confirm)
)

/**
 * @swagger
 * /user/preferences/result:
 *   get:
 *     tags: [User Preference]
 *     summary: Get admission result based on scores and preferences
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Result fetched
 */
preferenceRouter.get(
    '/result',
    asyncHandler(preferenceController.getResult)
)

/**
 * @swagger
 * /user/preferences/{id}:
 *   delete:
 *     tags: [User Preference]
 *     summary: Delete a preference
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted successfully
 */
preferenceRouter.delete(
    '/:id',
    asyncHandler(preferenceMiddleware.checkPreferenceId),
    asyncHandler(preferenceController.remove)
)

export default preferenceRouter
