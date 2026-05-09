import { Router } from 'express'
import * as paymentController from '@/app/controllers/user/payment.controller'
import { globalAuth } from '@/app/middleware/globalAuth.middleware'
import { allowAccountTypes } from '@/app/middleware/permission'
import { asyncHandler } from '@/utils/helpers'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: User Payment
 *   description: Payment and invoice management for users
 */

// Require authentication for all payment routes
router.use(asyncHandler(globalAuth))
router.use(asyncHandler(allowAccountTypes('user')))

/**
 * @swagger
 * /user/payment/invoice:
 *   get:
 *     tags: [User Payment]
 *     summary: Get current invoice based on preferences
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Invoice details fetched successfully
 */
router.get(
    '/invoice',
    asyncHandler(paymentController.getInvoice)
)

/**
 * @swagger
 * /user/payment/confirm:
 *   post:
 *     tags: [User Payment]
 *     summary: Confirm payment and create transaction
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentMethod:
 *                 type: string
 *                 enum: [vnpay, momo]
 *     responses:
 *       200:
 *         description: Payment confirmed
 */
router.post(
    '/confirm',
    asyncHandler(paymentController.confirmPayment)
)

/**
 * @swagger
 * /user/payment/status:
 *   get:
 *     tags: [User Payment]
 *     summary: Get payment status of user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Status fetched successfully
 */
router.get(
    '/status',
    asyncHandler(paymentController.getStatus)
)

export default router

