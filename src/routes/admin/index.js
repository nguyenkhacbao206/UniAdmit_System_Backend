import { Router } from 'express'
import authRouter from './auth.router'
import roleRouter from './role.router'
import staffRouter from './staff.router'
import universityRouter from './universities.router'
import majorRouter from './major.router'
import enrollmentRouter from './enrollment.router'
import admissionMethodRouter from './admission'
import surveyRouter from './survey.router'
import paymentRouter from './payment.router'

const admin = Router()

admin.use('/auth', authRouter)
admin.use('/roles', roleRouter)
admin.use('/staff', staffRouter)
admin.use('/universities', universityRouter)
admin.use('/majors', majorRouter)
admin.use('/enrollments', enrollmentRouter)
admin.use('/admission-method', admissionMethodRouter)
admin.use('/survey', surveyRouter)
admin.use('/payment', paymentRouter)

export default admin
