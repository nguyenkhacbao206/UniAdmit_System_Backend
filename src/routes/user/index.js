import {Router} from 'express'
import authRouter from './auth.router'
import profileRouter from './profile.route'
import scoreRouter from './score.route'

const user = Router()

user.use('/auth', authRouter)
user.use('/profile', profileRouter)
user.use('/scores', scoreRouter)

export default user
