import {Router} from 'express'
import authRouter from './auth.router'
import profileRouter from './profile.router'
import scoreRouter from './score.router'
import academicScoreRouter from './academic-score.router'

import preferenceRouter from './preference.router'
import surveyRouter from './survey.router'
import paymentRouter from './payment.router'
import enrollmentRouter from './enrollment.router'
import notificationRouter from './notification.router'
import applicationRouter from './application.router'
import forumRouter from './forum.router'
import accountRouter from './account.router'

const user = Router()

user.use('/auth', authRouter)
user.use('/profile', profileRouter)
user.use('/scores', scoreRouter)
user.use('/academic-scores', academicScoreRouter)
user.use('/preferences', preferenceRouter)
user.use('/survey', surveyRouter)
user.use('/payment', paymentRouter)
user.use('/enrollment', enrollmentRouter)
user.use('/notifications', notificationRouter)
user.use('/applications', applicationRouter)
user.use('/forum', forumRouter)
user.use('/account', accountRouter)
// account routes mounted

export default user

