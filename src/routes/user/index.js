import {Router} from 'express'
import authRouter from './auth.router'
import profileRouter from './profile.route'

const user = Router()

user.use('/auth', authRouter)
user.use('/profile', profileRouter)

export default user
