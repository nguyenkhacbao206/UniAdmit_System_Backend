import { Router } from 'express'
import authRouter from './auth.router'
import roleRouter from './role.router'
import universityRouter from './universities.router'
<<<<<<< HEAD
import majorRouter from './major.router'
import enrollmentRouter from './enrollment.router'
=======
import admissionMethodRouter from './admission'
>>>>>>> 27b44fe63035201c533dffe9b83c7009f8ffecda

const admin = Router()

admin.use('/auth', authRouter)
admin.use('/roles', roleRouter)
admin.use('/universities', universityRouter)
<<<<<<< HEAD
admin.use('/majors', majorRouter)
admin.use('/enrollments', enrollmentRouter)
=======
admin.use('/admission-method', admissionMethodRouter)
>>>>>>> 27b44fe63035201c533dffe9b83c7009f8ffecda

export default admin
