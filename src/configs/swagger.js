import swaggerJSDoc from 'swagger-jsdoc'
import path from 'path'
import { APP_URL_API, SOURCE_DIR } from './index.js'

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'UniAdmit System API Documentation',
            version: '1.0.0',
            description: `
## Quy trình Đăng nhập Google (OAuth2):
1. **Khởi tạo**: Client chuyển hướng trình duyệt của người dùng đến \`GET /auth/google\`.
2. **Xác thực**: Người dùng đăng nhập tài khoản Google và chấp nhận quyền truy cập.
3. **Xử lý**: Google chuyển hướng về Backend qua \`GET /auth/google/callback\`.
4. **Hoàn tất**: Backend xử lý dữ liệu, tạo/tìm User và chuyển hướng (Redirect 302) về Client theo địa chỉ:
   \`APP_URL_CLIENT/login-success?access_token=...&refresh_token=...&expire_in=...\`
5. **Sử dụng**: Client lấy Token từ URL và lưu vào LocalStorage/Cookie để sử dụng cho các API sau.
            `,
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
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                        phone: { type: 'string' },
                        avatar: { type: 'string' },
                        status: { type: 'string', enum: ['ACTIVE', 'DE_ACTIVE', 'UNVERIFIED'] },
                        created_at: { type: 'string', format: 'date-time' },
                    }
                },
                Admin: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                        phone: { type: 'string' },
                        status: { type: 'string', enum: ['ACTIVE', 'DE_ACTIVE'] },
                    }
                },
                AuthToken: {
                    type: 'object',
                    properties: {
                        access_token: { type: 'string' },
                        refresh_token: { type: 'string' },
                        expire_in: { type: 'integer' },
                        auth_type: { type: 'string', example: 'Bearer Token' },
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        status: { type: 'integer' },
                        success: { type: 'boolean', example: false },
                        message: { type: 'string' },
                        detail: { type: 'object' },
                    }
                },
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        status: { type: 'integer', example: 200 },
                        success: { type: 'boolean', example: true },
                        data: { type: 'object' },
                        message: { type: 'string' }
                    }
                }
            }
        },
    },
    apis: [
        path.join(SOURCE_DIR, 'routes/*.js'),
        path.join(SOURCE_DIR, 'routes/**/*.js'),
    ],
}

const swaggerSpec = swaggerJSDoc(swaggerOptions)

export default swaggerSpec
