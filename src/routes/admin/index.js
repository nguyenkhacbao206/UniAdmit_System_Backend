import {Router} from 'express'
import authRouter from './auth.router'
import roleRouter from './role.router'
import universityRouter from './universities.router'

const admin = Router()

admin.use('/auth', authRouter)
admin.use('/roles', roleRouter)
admin.use('/universities', universityRouter)

export default admin
