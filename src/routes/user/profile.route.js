import express from 'express'
import * as profileController from '@/app/controllers/user/profile.controller'
import validate from '@/app/middleware/user/validate'
import * as profileRequest from '@/app/requests/user/profile.request'
import { checkValidToken } from '@/app/middleware/user/auth.middleware'

const router = express.Router()

/**
 * @swagger
 * /user/profile:
 *   get:
 *     tags: [User Profile]
 *     summary: Get user profile
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 */
router.get('/', checkValidToken, profileController.getProfile)

/**
 * @swagger
 * /user/profile:
 *   put:
 *     tags: [User Profile]
 *     summary: Update user profile
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put('/', [
    checkValidToken,
    validate(profileRequest.updateProfile)
], profileController.updateProfile)

export default router
