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

/**
 * @swagger
 * /user/payment/webhook:
 *   post:
 *     tags: [User Payment]
 *     summary: PayOS webhook callback (no auth required)
 *     responses:
 *       200:
 *         description: Webhook processed
 */
router.post(
    '/webhook',
    asyncHandler(paymentController.handleWebhook)
)

/**
 * @swagger
 * /user/payment/return:
 *   get:
 *     tags: [User Payment]
 *     summary: Check payment result after PayOS redirect
 *     parameters:
 *       - in: query
 *         name: orderCode
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment result
 */
router.get(
    '/return',
    asyncHandler(paymentController.handlePaymentReturn)
)

// Require authentication for remaining routes
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
 *     parameters:
 *       - in: query
 *         name: round_id
 *         schema:
 *           type: string
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
 * /user/payment/create:
 *   post:
 *     tags: [User Payment]
 *     summary: Create PayOS payment link
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - round_id
 *             properties:
 *               round_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment link created
 */
router.post(
    '/create',
    asyncHandler(paymentController.createPaymentLink)
)

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
 *     parameters:
 *       - in: query
 *         name: round_id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status fetched successfully
 */
router.get(
    '/status',
    asyncHandler(paymentController.getStatus)
)

/**
 * @swagger
 * /user/payment/history:
 *   get:
 *     tags: [User Payment]
 *     summary: Get payment history of user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Payment history fetched successfully
 */
router.get(
    '/history',
    asyncHandler(paymentController.getPaymentHistory)
)

/**
 * @swagger
 * /user/payment/cancel:
 *   post:
 *     tags: [User Payment]
 *     summary: Cancel a pending payment
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - round_id
 *             properties:
 *               round_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment cancelled
 */
router.post(
    '/cancel',
    asyncHandler(paymentController.cancelPayment)
)

export default router
