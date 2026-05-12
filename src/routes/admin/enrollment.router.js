import * as enrollmentMiddleware from '@/app/middleware/admin/enrollment.middleware'
import * as enrollmentRequest from '@/app/requests/admin/enrollment.request'
import * as enrollmentController from '@/app/controllers/admin/enrollment.controller'
import { asyncHandler } from '@/utils/helpers'
import { allowAccountTypes, requireAdminRoles } from '@/app/middleware/permission'
import { globalAuth } from '@/app/middleware/globalAuth.middleware'
import { Router } from 'express'
import validate from '@/app/middleware/admin/validate'

const enrollmentRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Admin Enrollments
 *   description: Enrollment management for admins
 */

enrollmentRouter.use(asyncHandler(globalAuth))

/**
 * @swagger
 * /admin/enrollments:
 *   get:
 *     tags: [Admin Enrollments]
 *     summary: Get list of enrollments
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
enrollmentRouter.get(
    '/',
    asyncHandler(enrollmentController.getEnrollmentController)
)

/**
 * @swagger
 * /admin/enrollments/page:
 *   get:
 *     tags: [Admin Enrollments]
 *     summary: Get enrollments by page
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success
 */
enrollmentRouter.get(
    '/page',
    asyncHandler(enrollmentController.getEnrollmentByPage)
)

/**
 * @swagger
 * /admin/enrollments/search:
 *   get:
 *     tags: [Admin Enrollments]
 *     summary: Search enrollments
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *           description: Keyword to search
 *     responses:
 *       200:
 *         description: Success
 */
enrollmentRouter.get(
    '/search',
    asyncHandler(enrollmentController.getEnrollmentBySearchController)
)

/**
 * @swagger
 * /admin/enrollments/{enrollmentId}:
 *   get:
 *     tags: [Admin Enrollments]
 *     summary: Get enrollment details
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
enrollmentRouter.get(
    '/:id',
    asyncHandler(enrollmentMiddleware.checkEnrollmentId),
    asyncHandler(enrollmentController.getEnrollmentByIdController)
)

/**
 * @swagger
 * /admin/enrollments:
 *   post:
 *     tags: [Admin Enrollments]
 *     summary: Create an enrollment
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
 *               - name
 *               - year
 *               - startDate
 *               - endDate
 *             properties:
 *               code:
 *                 type: string
 *                 example: 'ENROLL2026'
 *               name:
 *                 type: string
 *                 example: 'Tuyển sinh năm 2026'
 *               year:
 *                 type: integer
 *                 example: 2026
 *               status:
 *                 type: string
 *                 enum: ['open', 'close']
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: '2026-06-01'
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: '2026-08-30'
 *     responses:
 *       201:
 *         description: Created
 */
enrollmentRouter.post(
    '/',
    asyncHandler(allowAccountTypes('admin')),
    asyncHandler(requireAdminRoles('super-admin', 'admin-manager')),
    asyncHandler(validate(enrollmentRequest.createRequest)),
    asyncHandler(enrollmentController.createEnollmentController)
)

/**
 * @swagger
 * /admin/enrollments/{enrollmentId}:
 *   put:
 *     tags: [Admin Enrollments]
 *     summary: Update an enrollment
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - name
 *               - year
 *               - startDate
 *               - endDate
 *             properties:
 *               code:
 *                 type: string
 *               name:
 *                 type: string
 *               year:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: ['open', 'close']
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Updated
 */
enrollmentRouter.put(
    '/:id',
    asyncHandler(allowAccountTypes('admin')),
    asyncHandler(requireAdminRoles('super-admin', 'admin-manager')),
    asyncHandler(enrollmentMiddleware.checkEnrollmentId),
    asyncHandler(validate(enrollmentRequest.updateRequest)),
    asyncHandler(enrollmentController.updateEnrollmentController)
)

/**
 * @swagger
 * /admin/enrollments/{enrollmentId}:
 *   delete:
 *     tags: [Admin Enrollments]
 *     summary: Delete an enrollment
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 */
enrollmentRouter.delete(
    '/:id',
    asyncHandler(allowAccountTypes('admin')),
    asyncHandler(requireAdminRoles('super-admin', 'admin-manager')),
    asyncHandler(enrollmentMiddleware.checkEnrollmentId),
    asyncHandler(enrollmentController.deleteEnrollmentController)
)

export default enrollmentRouter
