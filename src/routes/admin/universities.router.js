import * as universitiesMiddleware from '@/app/middleware/admin/universities.middleware'
import * as universitiesRequest from '@/app/requests/admin/universities.request'
import * as universitiesController from '@/app/controllers/admin/universities.controller'
import * as authMiddleware from '@/app/middleware/admin/auth.middleware'
import { asyncHandler } from '@/utils/helpers'
import { Router } from 'express'
import validate from '@/app/middleware/admin/validate'

const universityRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Admin Universities
 *   description: University management for admins
 */

universityRouter.use(asyncHandler(authMiddleware.checkValidToken))

/**
 * @swagger
 * /admin/universities:
 *   get:
 *     tags: [Admin Universities]
 *     summary: Get list of universities
 *     security:
 *       - BearerAuth: []
 */
universityRouter.get(
    '/',
    asyncHandler(validate(universitiesRequest.getList)),
    asyncHandler(universitiesController.getList)
)

/**
 * @swagger
 * /admin/universities/{universityId}:
 *   get:
 *     tags: [Admin Universities]
 *     summary: Get university details
 *     security:
 *       - BearerAuth: []
 */
universityRouter.get(
    '/:universityId',
    asyncHandler(universitiesMiddleware.checkUniversityId),
    asyncHandler(universitiesController.getDetail)
)

/**
 * @swagger
 * /admin/universities:
 *   post:
 *     tags: [Admin Universities]
 *     summary: Create a university
 *     security:
 *       - BearerAuth: []
 */
universityRouter.post(
    '/',
    asyncHandler(validate(universitiesRequest.createItem)),
    asyncHandler(universitiesController.createItem)
)

/**
 * @swagger
 * /admin/universities/{universityId}:
 *   put:
 *     tags: [Admin Universities]
 *     summary: Update a university
 *     security:
 *       - BearerAuth: []
 */
universityRouter.put(
    '/:universityId',
    asyncHandler(universitiesMiddleware.checkUniversityId),
    asyncHandler(validate(universitiesRequest.updateItem)),
    asyncHandler(universitiesController.updateItem)
)

/**
 * @swagger
 * /admin/universities/{universityId}:
 *   delete:
 *     tags: [Admin Universities]
 *     summary: Delete a university
 *     security:
 *       - BearerAuth: []
 */
universityRouter.delete(
    '/:universityId',
    asyncHandler(universitiesMiddleware.checkUniversityId),
    asyncHandler(universitiesController.deleteItem)
)

export default universityRouter
