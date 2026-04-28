import express from 'express'
import admin from './admin'
import user from './user'
import auth from './auth.router'
import staff from './staff/staff.router'
import staffSurvey from './staff/survey.router'

function route(app) {
    // Standard routes
    app.use('/admin', admin)
    app.use('/user', user)
    app.use('/auth', auth)
    app.use('/staff/survey', staffSurvey)
    app.use('/staff', staff)

    // API prefix routes for frontend compatibility
    app.use('/api/admin', admin)
    app.use('/api/user', user)
    app.use('/api/auth', auth)
    app.use('/api/staff/survey', staffSurvey)
    app.use('/api/staff', staff)
}

export default route
