import admin from './admin'
import user from './user'
import auth from './auth.router'
import staff from './staff/staff.router'
import staffSurvey from './staff/survey.router'
import staffApplication from './staff/application.router'
import staffSupplement from './staff/supplement.router'
import staffAdmission from './staff/admission.router'
import userSupplementRouter from './user/supplement.router'
import fileRouter from './file.router'

import * as fileController from '@/app/controllers/file.controller'
import { asyncHandler } from '@/utils/helpers'
import { globalAuth } from '@/app/middleware/globalAuth.middleware'

function route(app) {
    // Standard routes
    app.post('/file', asyncHandler(globalAuth), asyncHandler(fileController.upload))
    app.use('/admin', admin)
    app.use('/user', user)
    app.use('/user/supplements', userSupplementRouter)
    app.use('/file', fileRouter)
    app.use('/auth', auth)
    app.use('/staff/survey', staffSurvey)
    app.use('/staff/applications', staffApplication)
    app.use('/staff/supplements', staffSupplement)
    app.use('/staff/admission', staffAdmission)
    app.use('/staff', staff)

    // API prefix routes for frontend compatibility
    app.post('/api/file', asyncHandler(globalAuth), asyncHandler(fileController.upload))
    app.use('/api/admin', admin)
    app.use('/api/user', user)
    app.use('/api/user/supplements', userSupplementRouter)
    app.use('/api/file', fileRouter)
    app.use('/api/auth', auth)
    app.use('/api/staff/survey', staffSurvey)
    app.use('/api/staff/applications', staffApplication)
    app.use('/api/staff/supplements', staffSupplement)
    app.use('/api/staff/admission', staffAdmission)
    app.use('/api/staff', staff)
}

export default route
