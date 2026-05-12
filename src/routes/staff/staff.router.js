import { Router } from 'express'
import * as staffController from '@/app/controllers/staff/staff.controller'
import * as staffRequest from '@/app/requests/staff/staff.request'
import { asyncHandler } from '@/utils/helpers'
import validate from '@/app/middleware/admin/validate'
import { globalAuth } from '@/app/middleware/globalAuth.middleware'

const staffRouter = Router()

staffRouter.use(asyncHandler(globalAuth))

/**
 * @swagger
 * tags:
 *   name: Staff
 *   description: Staff management
 */

/**
 * @swagger
 * /staff:
 *   get:
 *     tags: [Staff]
 *     summary: Get all staff
 *     responses:
 *       200:
 *         description: List of staff
 */
staffRouter.get('/', asyncHandler(staffController.getStaffController))

/**
 * @swagger
 * /staff/{id}:
 *   get:
 *     tags: [Staff]
 *     summary: Get staff by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
staffRouter.get('/:id', asyncHandler(staffController.getStaffByIdController))

/**
 * @swagger
 * /staff:
 *   post:
 *     tags: [Staff]
 *     summary: Create new staff
 */
staffRouter.post(
    '/',
    asyncHandler(validate(staffRequest.createStaff)),
    asyncHandler(staffController.createStaffController)
)

/**
 * @swagger
 * /staff/{id}:
 *   put:
 *     tags: [Staff]
 *     summary: Update staff
 */
staffRouter.put(
    '/:id',
    asyncHandler(validate(staffRequest.updateStaff)),
    asyncHandler(staffController.updateStaffController)
)

/**
 * @swagger
 * /staff/{id}:
 *   delete:
 *     tags: [Staff]
 *     summary: Delete staff
 */
staffRouter.delete('/:id', asyncHandler(staffController.deleteStaffController))

/**
 * @swagger
 * /staff/search:
 *   post:
 *     tags: [Staff]
 *     summary: Search staff
 */
staffRouter.post('/search', asyncHandler(staffController.getStaffBySearchController))

/**
 * @swagger
 * /staff/pages:
 *   post:
 *     tags: [Staff]
 *     summary: Get staff by pages
 */
staffRouter.post('/pages', asyncHandler(staffController.getStaffByPagesController))

export default staffRouter
