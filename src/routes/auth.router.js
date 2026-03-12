import {Router} from 'express'
import {asyncHandler} from '@/utils/helpers'
import * as authController from '@/app/controllers/user/auth.controller'

const authRouter = Router()

authRouter.get(
    '/google',
    asyncHandler(authController.googleAuth)
)

authRouter.get(
    '/google/callback',
    asyncHandler(authController.googleCallback)
)

export default authRouter
