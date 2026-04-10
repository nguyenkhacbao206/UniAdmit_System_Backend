import admin from './admin'
import user from './user'
import auth from './auth.router'
import staff from './staff/staff.router'

function route(app) {
    app.use('/admin', admin)
    app.use('/user', user)
    app.use('/auth', auth)
    app.use('/staff', staff)
}

export default route
