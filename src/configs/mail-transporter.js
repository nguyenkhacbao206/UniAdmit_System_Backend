// --- Nodemailer SMTP (cũ - bị Render free chặn port 465/587) ---
// import nodemailer from 'nodemailer'
// const mailTransporter = nodemailer.createTransport({...})

// --- Brevo (gửi qua HTTPS API, không bị Render chặn) ---
import { BREVO_API_KEY, MAIL_FROM_ADDRESS, MAIL_FROM_NAME } from './constants'

console.log('MAIL CONFIG: Using Brevo API')

async function sendViaBrevo({ to, subject, html }) {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            'api-key': BREVO_API_KEY,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            sender: { name: MAIL_FROM_NAME, email: MAIL_FROM_ADDRESS },
            to: [{ email: to }],
            subject,
            htmlContent: html,
        }),
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(`Brevo error (${response.status}): ${data.message || JSON.stringify(data)}`)
    }

    return data
}

const mailTransporter = {
    sendMail(options, callback) {
        sendViaBrevo({
            to: options.to,
            subject: options.subject,
            html: options.html,
        })
            .then((result) => {
                console.log('📧 Email sent via Brevo:', result.messageId)
                if (callback) callback(null, result)
            })
            .catch((error) => {
                console.error('❌ Brevo error:', error)
                if (callback) callback(error)
            })
    },
}

export const sendMail = async ({ to, subject, html }) => {
    const result = await sendViaBrevo({ to, subject, html })
    console.log('📧 Email sent via Brevo:', result.messageId)
    return result
}

export default mailTransporter
