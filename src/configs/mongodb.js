import mongoose from 'mongoose'
import dns from 'dns'
import {DATABASE_URI, DB_NAME, DB_USERNAME, DB_PASSWORD, DB_AUTH_SOURCE} from './constants'

// Một số ISP / mạng nội bộ ở VN không trả về SRV record cho mongodb+srv://.
// Dev local: ép dùng Google + Cloudflare DNS để node resolver lấy được _mongodb._tcp...
if (process.env.NODE_ENV !== 'production') {
    try { dns.setServers(['8.8.8.8', '1.1.1.1']) } catch { /* ignore */ }
}

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
