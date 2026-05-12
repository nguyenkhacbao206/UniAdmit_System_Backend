import * as majorMiddleware from '@/app/middleware/admin/major.middleware'
import * as majorRequest from '@/app/requests/admin/major.request'
import * as majorController from '@/app/controllers/admin/major.controller'
import { globalAuth } from '@/app/middleware/globalAuth.middleware'
import { asyncHandler } from '@/utils/helpers'
import { allowAccountTypes, requireAdminRoles } from '@/app/middleware/permission'
import { Router } from 'express'
import validate from '@/app/middleware/admin/validate'

const majorRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Admin Majors
 *   description: Major management for admins
 */

majorRouter.use(asyncHandler(globalAuth))

/**
 * @swagger
 * /admin/majors:
 *   get:
 *     tags: [Admin Majors]
 *     summary: Get list of majors
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
majorRouter.get(
    '/',
    asyncHandler(allowAccountTypes('admin', 'user', 'staff')),
    asyncHandler(majorController.getMajorController)
)

majorRouter.get(
    '/page',
    asyncHandler(allowAccountTypes('admin', 'user', 'staff')),
    asyncHandler(majorController.getMajorByPage)
)

/**
 * @swagger
 * /admin/majors/search:
 *   get:
 *     tags: [Admin Majors]
 *     summary: Search majors
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
majorRouter.get(
    '/search',
    asyncHandler(allowAccountTypes('admin', 'user', 'staff')),
    asyncHandler(majorController.getMajorBySearchController)
)

/**
 * @swagger
 * /admin/majors/{majorId}:
 *   get:
 *     tags: [Admin Majors]
 *     summary: Get major details
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: majorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
majorRouter.get(
    '/:id',
    asyncHandler(allowAccountTypes('admin', 'user', 'staff')),
    asyncHandler(majorMiddleware.checkMajorId),
    asyncHandler(majorController.getMajorByIdController)
)

/**
 * @swagger
 * /admin/majors:
 *   post:
 *     tags: [Admin Majors]
 *     summary: Create a major
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
 *               - category
 *               - university_id
 *               - quota
 *             properties:
 *               code:
 *                 type: string
 *                 example: 'IT1'
 *               name:
 *                 type: string
 *                 example: 'Khoa học Máy tính'
 *               category:
 *                 type: string
 *                 example: 'Xét điểm thi THPT'
 *               university_id:
 *                 type: string
 *                 example: '60c72b2f9b1d8e001f8e4c1d'
 *               quota:
 *                 type: integer
 *                 example: 300
 *               description:
 *                 type: string
 *                 example: 'Chương trình chuẩn Khoa học Máy tính'
 *               duration:
 *                 type: string
 *                 enum: ['4 năm', '5 năm', '6 năm', '7 năm', '8 năm']
 *               status:
 *                 type: string
 *                 enum: ['active', 'inactive']
 *     responses:
 *       201:
 *         description: Created
 */
majorRouter.post(
    '/',
    asyncHandler(allowAccountTypes('admin')),
    asyncHandler(requireAdminRoles('super-admin', 'admin-manager',)),
    asyncHandler(validate(majorRequest.createItem)),
    asyncHandler(majorController.createMajorController)
)

/**
 * @swagger
 * /admin/majors/{majorId}:
 *   put:
 *     tags: [Admin Majors]
 *     summary: Update a major
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: majorId
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
 *               - category
 *               - university_id
 *               - quota
 *             properties:
 *               code:
 *                 type: string
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               university_id:
 *                 type: string
 *               quota:
 *                 type: integer
 *               description:
 *                 type: string
 *               duration:
 *                 type: string
 *                 enum: ['4 năm', '5 năm', '6 năm', '7 năm', '8 năm']
 *               status:
 *                 type: string
 *                 enum: ['active', 'inactive']
 *     responses:
 *       200:
 *         description: Updated
 */
majorRouter.put(
    '/:id',
    asyncHandler(allowAccountTypes('admin')),
    asyncHandler(requireAdminRoles('super-admin', 'admin-manager')),
    asyncHandler(majorMiddleware.checkMajorId),
    asyncHandler(validate(majorRequest.updateItem)),
    asyncHandler(majorController.updateMajorController)
)

/**
 * @swagger
 * /admin/majors/{majorId}:
 *   delete:
 *     tags: [Admin Majors]
 *     summary: Delete a major
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: majorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 */
majorRouter.delete(
    '/:id',
    asyncHandler(allowAccountTypes('admin')),
    asyncHandler(requireAdminRoles('super-admin', 'admin-manager')),
    asyncHandler(majorMiddleware.checkMajorId),
    asyncHandler(majorController.daleteMajorController)
)

export default majorRouter
