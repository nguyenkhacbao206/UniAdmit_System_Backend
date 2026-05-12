import * as universitiesMiddleware from '@/app/middleware/admin/universities.middleware'
import * as universitiesRequest from '@/app/requests/admin/universities.request'
import * as universitiesController from '@/app/controllers/admin/universities.controller'
import { globalAuth } from '@/app/middleware/globalAuth.middleware'
import { asyncHandler } from '@/utils/helpers'
import { allowAccountTypes, requireAdminRoles } from '@/app/middleware/permission'
import { Router } from 'express'
import validate from '@/app/middleware/admin/validate'

const universityRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Admin Universities
 *   description: University management for admins
 */

universityRouter.use(
    asyncHandler(globalAuth))

/**
 * @swagger
 * /admin/universities:
 *   get:
 *     tags: [Admin Universities]
 *     summary: Get list of universities
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search keyword
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Success
 */
universityRouter.get(
    '/',
    asyncHandler(allowAccountTypes('admin', 'user')),
    asyncHandler(validate(universitiesRequest.getList)),
    asyncHandler(universitiesController.getUniversitiesController)
)

universityRouter.get(
    '/page',
    asyncHandler(allowAccountTypes('admin', 'user')),
    asyncHandler(universitiesController.getUniversityByPage)
)

/**
 * @swagger
 * /admin/universities/{universityId}:
 *   get:
 *     tags: [Admin Universities]
 *     summary: Get university details
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: universityId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/University'
 */
universityRouter.get(
    '/:id',
    asyncHandler(allowAccountTypes('admin', 'user')),
    asyncHandler(universitiesMiddleware.checkUniversityId),
    asyncHandler(universitiesController.getUniversityByIdController)
)

/**
 * @swagger
 * /admin/universities:
 *   post:
 *     tags: [Admin Universities]
 *     summary: Create a university
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
 *             properties:
 *               code:
 *                 type: string
 *                 example: 'BKA'
 *               name:
 *                 type: string
 *                 example: 'Đại học Bách Khoa Hà Nội'
 *               location:
 *                 type: string
 *                 example: 'Hà Nội'
 *               majors:
 *                 type: integer
 *                 example: 50
 *               status:
 *                 type: string
 *                 enum: ['active', 'inactive']
 *     responses:
 *       201:
 *         description: Created
 */
universityRouter.post(
    '/',
    asyncHandler(allowAccountTypes('admin')),
    asyncHandler(requireAdminRoles('super-admin', 'admin-manager')),
    asyncHandler(validate(universitiesRequest.createItem)),
    asyncHandler(universitiesController.createUniversitiesController)
)

/**
 * @swagger
 * /admin/universities/{universityId}:
 *   put:
 *     tags: [Admin Universities]
 *     summary: Update a university
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: universityId
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
 *             properties:
 *               code:
 *                 type: string
 *                 example: 'BKA'
 *               name:
 *                 type: string
 *                 example: 'Đại học Bách Khoa Hà Nội'
 *               location:
 *                 type: string
 *               majors:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: ['active', 'inactive']
 *     responses:
 *       200:
 *         description: Updated
 */
universityRouter.put(
    '/:id',
    asyncHandler(allowAccountTypes('admin')),
    asyncHandler(requireAdminRoles('super-admin', 'admin-manager')),
    asyncHandler(universitiesMiddleware.checkUniversityId),
    asyncHandler(validate(universitiesRequest.updateItem)),
    asyncHandler(universitiesController.updateUniversitiesController)
)

/**
 * @swagger
 * /admin/universities/{universityId}:
 *   delete:
 *     tags: [Admin Universities]
 *     summary: Delete a university
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: universityId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 */
universityRouter.delete(
    '/:id',
    asyncHandler(allowAccountTypes('admin')),
    asyncHandler(requireAdminRoles('super-admin', 'admin-manager')),
    asyncHandler(universitiesMiddleware.checkUniversityId),
    asyncHandler(universitiesController.deleteUniversitiesController)
)

export default universityRouter
