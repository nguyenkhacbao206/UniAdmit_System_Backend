import cors from 'cors'
import {APP_URL_CLIENT, OTHER_URLS_CLIENT} from '@/configs'

const ALLOWED_ORIGINS = [
    'https://eloquent-sundae-135fe1.netlify.app',
]

export const corsOptions = {
    origin: [...new Set([APP_URL_CLIENT, ...OTHER_URLS_CLIENT, ...ALLOWED_ORIGINS])],
    credentials: true,
}

const corsHandler = cors(corsOptions)

export default corsHandler
