import admin from './admin'
import user from './user'
import auth from './auth.router'

function route(app) {
    app.use('/admin', admin),
    app.use('/user', user),
    app.use('/auth', auth)
}

export default route
