import swaggerJSDoc from 'swagger-jsdoc'
import path from 'path'
import { APP_URL_API, SOURCE_DIR } from './index.js'

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'UniAdmit System API Documentation',
            version: '1.0.0',
            description: 'API documentation for UniAdmit System backend.',
        },
        servers: [
            {
                url: APP_URL_API,
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: [
        path.join(SOURCE_DIR, 'routes/*.js'),
        path.join(SOURCE_DIR, 'routes/**/*.js'),
    ],
}

const swaggerSpec = swaggerJSDoc(swaggerOptions)

export default swaggerSpec

