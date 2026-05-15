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
 * /admin/payment/stats:
 *   get:
 *     tags: [Admin Payment]
 *     summary: Get payment statistics
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get(
    '/stats',
    asyncHandler(requireAdminRoles('super-admin', 'admin-manager')),
    asyncHandler(paymentController.getPaymentStats)
)

/**
 * @swagger
 * /admin/payment/all:
 *   get:
 *     tags: [Admin Payment]
 *     summary: Get all user invoices (with filter and pagination)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, paid, cancelled]
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
router.get(
    '/all',
    asyncHandler(requireAdminRoles('super-admin', 'admin-manager')),
    asyncHandler(paymentController.getAllInvoices)
)

/**
 * @swagger
 * /admin/payment/{id}:
 *   get:
 *     tags: [Admin Payment]
 *     summary: Get invoice detail by ID
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
 *         description: Success
 */
router.get(
    '/:id',
    asyncHandler(requireAdminRoles('super-admin', 'admin-manager')),
    asyncHandler(paymentController.getInvoiceDetail)
)

export default router
