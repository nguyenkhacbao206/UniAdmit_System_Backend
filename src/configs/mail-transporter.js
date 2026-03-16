import nodemailer from 'nodemailer'

import {
    MAIL_HOST,
    MAIL_PORT,
    MAIL_SECURE,
    MAIL_USERNAME,
    MAIL_PASSWORD,
    MAIL_FROM_ADDRESS,
    MAIL_FROM_NAME
} from './constants'

// Debug config khi server start
console.log('MAIL CONFIG:', {
    host: MAIL_HOST,
    port: MAIL_PORT,
    secure: MAIL_SECURE || Number(MAIL_PORT) === 465,
    user: MAIL_USERNAME
})

// Tạo transporter
const mailTransporter = nodemailer.createTransport({
    host: MAIL_HOST || 'smtp.gmail.com',
    port: Number(MAIL_PORT) || 465,
    secure: MAIL_SECURE || Number(MAIL_PORT) === 465, // true = SSL (port 465), false = STARTTLS (port 587)
    auth: {
        user: MAIL_USERNAME,
        pass: MAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 20000
})

// Kiểm tra kết nối SMTP khi server start
mailTransporter.verify()
    .then(() => {
        console.log('✅ SMTP Server is ready to send emails')
    })
    .catch((error) => {
        console.error('❌ SMTP connection error:', error)
    })

// Hàm gửi mail
export const sendMail = async ({ to, subject, html }) => {
    try {

        const mailOptions = {
            from: `"${MAIL_FROM_NAME || 'UniAdmit System'}" <${MAIL_FROM_ADDRESS || MAIL_USERNAME}>`,
            to: to,
            subject: subject,
            html: html
        }

        const info = await mailTransporter.sendMail(mailOptions)

        console.log('📧 Email sent:', info.messageId)

        return info

    } catch (error) {

        console.error('❌ Send mail error:', error)

        throw error
    }
}

export default mailTransporter
