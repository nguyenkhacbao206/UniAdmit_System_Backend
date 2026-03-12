import mongoose from 'mongoose'
import {DATABASE_URI, DB_NAME, DB_USERNAME, DB_PASSWORD, DB_AUTH_SOURCE} from './constants'

const mongoDb = {
    connect() {
        return mongoose.connect(DATABASE_URI, {
            dbName: DB_NAME,
            user: DB_USERNAME,
            pass: DB_PASSWORD,
            authSource: DB_AUTH_SOURCE,
            autoCreate: true,
            autoIndex: true,
            connectTimeoutMS: 30000,
            socketTimeoutMS: 30000,
            serverSelectionTimeoutMS: 30000,
        })
    },
    close(force) {
        return mongoose.connection.close(force)
    },
    transaction(...args) {
        return mongoose.connection.transaction(...args)
    },
    isDisconnected() {
        return mongoose.connection.readyState === 0
    },
}

export default mongoDb
