import { Router } from 'express'
import * as admissionMethodMiddleware from '@/app/middleware/admin/admission-method.middleware'
import * as admissionMethodRequest from '@/app/requests/admin/admission-method.request'
import * as admissionMethodController from '@/app/controllers/admin/admission-method.controller'
import * as authMiddleware from '@/app/middleware/admin/auth.middleware'
import { asyncHandler } from '@/utils/helpers'
import validate from '@/app/middleware/admin/validate'

const admissionMethodRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Admin Admission Method
 *   description: Admission method management for admins
 */

admissionMethodRouter.use(asyncHandler(authMiddleware.checkValidToken))

/**
 * @swagger
 * /admin/admission-method:
 *   get:
 *     tags: [Admin Admission Method]
 *     summary: Get list of admission methods
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         description: Search by code
 *       - in: query
 *         name: method
 *         schema:
 *           type: string
 *         description: Search by method name
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: Search by description
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Active, Inactive]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: Success
 */
admissionMethodRouter.get(
    '/',
    asyncHandler(validate(admissionMethodRequest.getList)),
    asyncHandler(admissionMethodController.readRoot)
)

/**
 * @swagger
 * /admin/admission-method/{admissionMethodId}:
 *   get:
 *     tags: [Admin Admission Method]
 *     summary: Get admission method details
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: admissionMethodId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
admissionMethodRouter.get(
    '/:admissionMethodId',
    asyncHandler(admissionMethodMiddleware.checkAdmissionMethodId),
    asyncHandler(admissionMethodController.getDetail)
)

/**
 * @swagger
 * /admin/admission-method:
 *   post:
 *     tags: [Admin Admission Method]
 *     summary: Create a new admission method
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - methodName
 *               - description
 *             properties:
 *               code:
 *                 type: string
 *               methodName:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *                 default: Active
 *     responses:
 *       201:
 *         description: Admission method created
 */
admissionMethodRouter.post(
    '/',
    asyncHandler(validate(admissionMethodRequest.createItem)),
    asyncHandler(admissionMethodController.createItem)
)

/**
 * @swagger
 * /admin/admission-method/{admissionMethodId}:
 *   put:
 *     tags: [Admin Admission Method]
 *     summary: Update an admission method
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: admissionMethodId
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
 *               code:
 *                 type: string
 *               methodName:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Admission method updated
 */
admissionMethodRouter.put(
    '/:admissionMethodId',
    asyncHandler(admissionMethodMiddleware.checkAdmissionMethodId),
    asyncHandler(validate(admissionMethodRequest.updateItem)),
    asyncHandler(admissionMethodController.updateItem)
)

/**
 * @swagger
 * /admin/admission-method/{admissionMethodId}:
 *   delete:
 *     tags: [Admin Admission Method]
 *     summary: Delete an admission method
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: admissionMethodId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admission method deleted
 */
admissionMethodRouter.delete(
    '/:admissionMethodId',
    asyncHandler(admissionMethodMiddleware.checkAdmissionMethodId),
    asyncHandler(admissionMethodController.deleteItem)
)

export default admissionMethodRouter
