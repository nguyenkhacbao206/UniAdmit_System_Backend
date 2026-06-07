import createModel, { STATUS_ACCOUNT } from './base'
import bcrypt from 'bcrypt'

const User = createModel(
    'User',
    'users',
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            lowercase: true,
            required: function () {
                return !this.phone
            }
        },
        phone: {
            type: String,
            required: function () {
                return !this.email
            }
        },
        gender: {
            type: String,
            default: ''
        },
        dob: {
            type: Date,
            default: null
        },
        address: {
            type: String,
            default: ''
        },
        avatar: {
            type: String,
            default: '',
        },
        password: {
            type: String,
            required: true,
            set(value) {
                const salt = bcrypt.genSaltSync(10)
                return bcrypt.hashSync(value, salt)
            },
        },
        status: {
            type: String,
            enum: Object.values(STATUS_ACCOUNT),
            required: true,
            default: STATUS_ACCOUNT.UNVERIFIED,
        },

        isConfirmed: {
            type: Boolean,
            default: false
        },
        isSubmitted: {
            type: Boolean,
            default: false
        },

        otp: {
            type: String,
            default: '',
        },
        otp_expired_at: {
            type: Date,
            default: null,
        },
        // Cài đặt cá nhân — user tự bật/tắt trong trang "Cài đặt hệ thống".
        notification_preferences: {
            resultUpdates:   { type: Boolean, default: true },
            applicationReminders: { type: Boolean, default: true },
            paymentReminders:   { type: Boolean, default: true },
            pushNotifications:  { type: Boolean, default: false },
        },
        language: {
            type: String,
            enum: ['vi', 'en'],
            default: 'vi',
        },
        deleted: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        toJSON: {
            virtuals: true,
            transform(doc, ret) {
                // eslint-disable-next-line no-unused-vars
                const { password, deleted, otp, otp_expired_at, ...result } = ret
                return result
            },
        },
        methods: {
            verifyPassword(password) {
                return bcrypt.compareSync(password, this.password)
            },
        },
        virtuals: {
            permissions: {
                set(value) {
                    this._permissions = value
                },
                get() {
                    return this._permissions
                },
            },
        },
    }
)

export default User
