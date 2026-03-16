import {Router} from 'express'
import authRouter from './auth.router'
import profileRouter from './profile.router'
import scoreRouter from './score.router'

const user = Router()

user.use('/auth', authRouter)
user.use('/profile', profileRouter)
user.use('/scores', scoreRouter)

export default user
