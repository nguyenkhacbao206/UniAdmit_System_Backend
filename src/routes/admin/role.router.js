import * as roleMiddleware from '@/app/middleware/admin/role.middleware'
import * as roleRequest from '@/app/requests/admin/role.request'
import * as roleController from '@/app/controllers/admin/role.controller'
import * as authMiddleware from '@/app/middleware/admin/auth.middleware'
import {asyncHandler} from '@/utils/helpers'
import {requireRole} from '@/app/middleware/permission'
import {Router} from 'express'
import validate from '@/app/middleware/admin/validate'

const roleRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Admin Role
 *   description: Role management for admins
 */

roleRouter.use(asyncHandler(authMiddleware.checkValidToken))

/**
 * @swagger
 * /admin/role:
 *   get:
 *     tags: [Admin Role]
 *     summary: Get all roles
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of roles
 */
roleRouter.get(
    '/',
    asyncHandler(roleController.readRoot),
)

/**
 * @swagger
 * /admin/role/permission-types:
 *   get:
 *     tags: [Admin Role]
 *     summary: Get all permission types
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of permission types
 */
roleRouter.get(
    '/permission-types',
    asyncHandler(roleController.readPermissionTypes)
)

/**
 * @swagger
 * /admin/role:
 *   post:
 *     tags: [Admin Role]
 *     summary: Create a new role
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - code
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Role created
 */
roleRouter.post(
    '/',
    asyncHandler(requireRole(['super-admin'], 'admin')),
    asyncHandler(validate(roleRequest.createItem)),
    asyncHandler(roleController.createItem)
)

/**
 * @swagger
 * /admin/role/{roleId}:
 *   put:
 *     tags: [Admin Role]
 *     summary: Update a role
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Role updated
 */
roleRouter.put(
    '/:roleId',
    asyncHandler(requireRole(['super-admin'], 'admin')),
    asyncHandler(roleMiddleware.checkRoleId),
    roleMiddleware.canUpdate,
    asyncHandler(validate(roleRequest.updateItem)),
    asyncHandler(roleController.updateItem)
)

/**
 * @swagger
 * /admin/role/{roleId}:
 *   delete:
 *     tags: [Admin Role]
 *     summary: Delete a role
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Role deleted
 */
roleRouter.delete(
    '/:roleId',
    asyncHandler(requireRole(['super-admin'], 'admin')),
    asyncHandler(roleMiddleware.checkRoleId),
    roleMiddleware.canDelete,
    asyncHandler(roleController.deleteItem)
)

/**
 * @swagger
 * /admin/role/{roleId}/permissions:
 *   get:
 *     tags: [Admin Role]
 *     summary: Get permissions of a role
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of permissions
 */
roleRouter.get(
    '/:roleId/permissions',
    asyncHandler(roleMiddleware.checkRoleId),
    asyncHandler(roleController.readPermissionsOfRole)
)

/**
 * @swagger
 * /admin/role/{roleId}/update-permission-for-role/{permissionId}:
 *   patch:
 *     tags: [Admin Role]
 *     summary: Switch permission of a role
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: permissionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Permission updated
 */
roleRouter.patch(
    '/:roleId/update-permission-for-role/:permissionId',
    asyncHandler(requireRole(['super-admin'], 'admin')),
    asyncHandler(roleMiddleware.checkRoleId),
    roleMiddleware.canUpdate,
    asyncHandler(roleMiddleware.checkPermissionId),
    asyncHandler(roleController.switchPermissionOfRole)
)

/**
 * @swagger
 * /admin/role/{roleId}/accounts:
 *   get:
 *     tags: [Admin Role]
 *     summary: Get accounts with a specific role
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of accounts
 */
roleRouter.get(
    '/:roleId/accounts',
    asyncHandler(roleMiddleware.checkRoleId),
    asyncHandler(validate(roleRequest.readAccounts)),
    asyncHandler(roleController.readAccountsWithRole)
)

/**
 * @swagger
 * /admin/role/{roleId}/accounts-without-role:
 *   get:
 *     tags: [Admin Role]
 *     summary: Get accounts without a specific role
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of accounts
 */
roleRouter.get(
    '/:roleId/accounts-without-role',
    asyncHandler(roleMiddleware.checkRoleId),
    asyncHandler(validate(roleRequest.readAccounts)),
    asyncHandler(roleController.readAccountsWithoutRole)
)

/**
 * @swagger
 * /admin/role/{roleId}/add-accounts:
 *   patch:
 *     tags: [Admin Role]
 *     summary: Add accounts to a role
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
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
 *               - account_ids
 *             properties:
 *               account_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Accounts added
 */
roleRouter.patch(
    '/:roleId/add-accounts',
    asyncHandler(requireRole(['super-admin'], 'admin')),
    asyncHandler(roleMiddleware.checkRoleId),
    roleMiddleware.canUpdate,
    asyncHandler(validate(roleRequest.addAccountsForRole)),
    asyncHandler(roleController.addAccountsForRole)
)

/**
 * @swagger
 * /admin/role/{roleId}/delete-account-in-role/{accountId}:
 *   delete:
 *     tags: [Admin Role]
 *     summary: Delete an account from a role
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Account removed from role
 */
roleRouter.delete(
    '/:roleId/delete-account-in-role/:accountId',
    asyncHandler(requireRole(['super-admin'], 'admin')),
    asyncHandler(roleMiddleware.checkRoleId),
    roleMiddleware.canUpdate,
    asyncHandler(roleMiddleware.checkAccountId),
    asyncHandler(roleController.deleteAccountInRole)
)

export default roleRouter
