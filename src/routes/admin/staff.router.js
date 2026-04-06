import { Router } from 'express'
import * as staffController from '@/app/controllers/admin/staff.controller'
import * as staffRequest from '@/app/requests/admin/staff.request'
import * as authMiddleware from '@/app/middleware/admin/auth.middleware'
import { asyncHandler } from '@/utils/helpers'
import { requireRole } from '@/app/middleware/permission'
import validate from '@/app/middleware/admin/validate'

const staffRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Admin Staff
 *   description: Staff management for admins
 */

staffRouter.use(asyncHandler(authMiddleware.checkValidToken))

/**
 * @swagger
 * /admin/staff:
 *   get:
 *     tags: [Admin Staff]
 *     summary: Get all staff accounts
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of staff
 */
staffRouter.get('/', asyncHandler(requireRole(['super-admin'])), asyncHandler(staffController.getStaffs))

/**
 * @swagger
 * /admin/staff:
 *   post:
 *     tags: [Admin Staff]
 *     summary: Create a new staff account
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Staff account created
 */
staffRouter.post(
    '/', 
    asyncHandler(requireRole(['super-admin'])), 
    asyncHandler(validate(staffRequest.createStaff)), 
    asyncHandler(staffController.createStaff)
)

/**
 * @swagger
 * /admin/staff/{id}:
 *   put:
 *     tags: [Admin Staff]
 *     summary: Update a staff account
 *     security:
 *       - BearerAuth: []
 */
staffRouter.put(
    '/:id', 
    asyncHandler(requireRole(['super-admin'])), 
    asyncHandler(validate(staffRequest.updateStaff)), 
    asyncHandler(staffController.updateStaff)
)

/**
 * @swagger
 * /admin/staff/{id}:
 *   delete:
 *     tags: [Admin Staff]
 *     summary: Delete a staff account
 *     security:
 *       - BearerAuth: []
 */
staffRouter.delete('/:id', asyncHandler(requireRole(['super-admin'])), asyncHandler(staffController.deleteStaff))

export default staffRouter
