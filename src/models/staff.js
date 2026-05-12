import createModel from './base'
import bcrypt from 'bcrypt'

const Staff = createModel(
    'Staff',
    'staffs',
    {
        code: {
            type: String,
            default: ''
        },

        name: {
            type: String,
            required: true
        },

        mail: {
            type: String,
            required: true,
            lowercase: true
        },

        phone: {
            type: String,
            required: true
        },

        password: {
            type: String,
            required: true
        },

        status: {
            type: String,
            required: true,
            enum: ['active', 'inactive'],
            default: 'active'
        },

        deleted: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    {
        methods: {
            verifyPassword(password) {
                if (this.password && this.password.startsWith('$2')) {
                    return bcrypt.compareSync(password, this.password)
                }
                return password === this.password
            }
        }
    }
)

export default Staff