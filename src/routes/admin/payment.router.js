import { Router } from 'express'
import * as paymentController from '@/app/controllers/admin/payment.controller'
import { globalAuth } from '@/app/middleware/globalAuth.middleware'
import { allowAccountTypes, requireAdminRoles } from '@/app/middleware/permission'
import { asyncHandler } from '@/utils/helpers'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Admin Payment
 *   description: Payment management for admins
 */

router.use(asyncHandler(globalAuth))
router.use(asyncHandler(allowAccountTypes('admin')))

/**
 * @swagger
 * /admin/payment/all:
 *   get:
 *     tags: [Admin Payment]
 *     summary: Get all user invoices
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get(
    '/all',
    asyncHandler(requireAdminRoles('super-admin', 'admin-manager')),
    asyncHandler(paymentController.getAllInvoices)
)

export default router
