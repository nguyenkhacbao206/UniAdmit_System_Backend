import {Router} from 'express'
import authRouter from './auth.router'
import profileRouter from './profile.router'
import scoreRouter from './score.router'
import academicScoreRouter from './academic-score.router'

import preferenceRouter from './preference.router'

const user = Router()

user.use('/auth', authRouter)
user.use('/profile', profileRouter)
user.use('/scores', scoreRouter)
user.use('/academic-scores', academicScoreRouter)
user.use('/preferences', preferenceRouter)



export default user
