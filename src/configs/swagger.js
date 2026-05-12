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
                ProfileDetail: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        ethnicity: { type: 'string' },
                        gender: { type: 'string' },
                        dob: { type: 'string', format: 'date' },
                        permanentAddress: { type: 'string' },
                        contactAddress: { type: 'string' },
                        cccd: { type: 'string' },
                        place_of_issue: { type: 'string' },
                        avatar: { type: 'string' },
                        cv: { type: 'string' },
                        school: { type: 'string' },
                        score: { type: 'number' },
                        rank: { type: 'string' },
                    }
                },
                UserWithProfile: {
                    type: 'object',
                    allOf: [
                        { $ref: '#/components/schemas/User' },
                        {
                            type: 'object',
                            properties: {
                                profile: { $ref: '#/components/schemas/ProfileDetail' }
                            }
                        }
                    ]
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
                },
                Score: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        user_id: { type: 'string' },
                        math: { type: 'number', default: 0 },
                        literature: { type: 'number', default: 0 },
                        english: { type: 'number', default: 0 },
                        physics: { type: 'number', default: 0 },
                        chemistry: { type: 'number', default: 0 },
                        biology: { type: 'number', default: 0 },
                        history: { type: 'number', default: 0 },
                        geography: { type: 'number', default: 0 },
                        civic_education: { type: 'number', default: 0 },
                        combinations: { type: 'object' },
                        average: { type: 'number', default: 0 },
                        verified: { type: 'boolean', default: false },
                    }
                },
                AcademicScoreSemester: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        scores: {
                            type: 'object',
                            properties: {
                                math: { type: 'number', default: 0 },
                                literature: { type: 'number', default: 0 },
                                english: { type: 'number', default: 0 },
                                physics: { type: 'number', default: 0 },
                                chemistry: { type: 'number', default: 0 },
                                biology: { type: 'number', default: 0 },
                                history: { type: 'number', default: 0 },
                                geography: { type: 'number', default: 0 },
                                civic_education: { type: 'number', default: 0 },
                            }
                        },
                        average: { type: 'number', default: 0 },
                        conduct: { type: 'string', default: 'Tốt' },
                        academic_rank: { type: 'string', default: 'Giỏi' }
                    }
                },
                AcademicScore: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        user_id: { type: 'string' },
                        semesters: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/AcademicScoreSemester' }
                        }
                    }
                },
                University: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        code: { type: 'string', example: 'BKA' },
                        name: { type: 'string', example: 'Đại học Bách Khoa Hà Nội' },
                        location: { type: 'string', example: 'Hà Nội' },
                        majors: { type: 'integer', example: 50 },
                        status: { type: 'string', enum: ['active', 'inactive'], default: 'active' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
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
