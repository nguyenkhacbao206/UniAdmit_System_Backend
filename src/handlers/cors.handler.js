import cors from 'cors'
import {APP_URL_CLIENT, OTHER_URLS_CLIENT} from '@/configs'

// Origins được hardcode whitelist (cũ — giữ để backward-compat).
const ALLOWED_ORIGINS = [
    'https://eloquent-sundae-135fe1.netlify.app',
    'https://jade-beijinho-692fbb.netlify.app',
    'https://uniadmitsystem.netlify.app',
]

// Regex whitelist: cho phép mọi subdomain Netlify / Vercel / Cloudflare Pages
// + localhost dev. Mỗi lần đổi tên site Netlify hoặc redeploy ra URL mới,
// không cần update BE.
const ORIGIN_REGEXES = [
    /^https:\/\/[a-z0-9-]+\.netlify\.app$/i,
    /^https:\/\/[a-z0-9-]+\.vercel\.app$/i,
    /^https:\/\/[a-z0-9-]+\.pages\.dev$/i,
    /^http:\/\/localhost(:\d+)?$/i,
    /^http:\/\/127\.0\.0\.1(:\d+)?$/i,
]

const STATIC_ALLOWED = new Set(
    [APP_URL_CLIENT, ...OTHER_URLS_CLIENT, ...ALLOWED_ORIGINS].filter(Boolean)
)

export const corsOptions = {
    // cors lib accepts function form: (origin, callback) => callback(err, allowed).
    // null origin (curl, native app, server-to-server) cũng cho qua.
    origin(origin, callback) {
        if (!origin) return callback(null, true)
        if (STATIC_ALLOWED.has(origin)) return callback(null, true)
        if (ORIGIN_REGEXES.some((rx) => rx.test(origin))) return callback(null, true)
        return callback(new Error(`CORS: origin ${origin} không nằm trong whitelist`))
    },
    credentials: true,
}

const corsHandler = cors(corsOptions)

export default corsHandler
