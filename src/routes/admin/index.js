import { Router } from 'express'
import authRouter from './auth.router'
import roleRouter from './role.router'
import universityRouter from './universities.router'
import majorRouter from './major.router'
import enrollmentRouter from './enrollment.router'

const admin = Router()

admin.use('/auth', authRouter)
admin.use('/roles', roleRouter)
admin.use('/universities', universityRouter)
admin.use('/majors', majorRouter)
admin.use('/enrollments', enrollmentRouter)

export default admin
