import assert from 'assert'
import _ from 'lodash'
import statuses from 'statuses'
import ejs from 'ejs'
import {
    logger,
    MAIL_FROM_ADDRESS,
    MAIL_FROM_NAME,
    mailTransporter,
    STATUS_DEFAULT_MESSAGE,
    VIEW_DIR,
} from '@/configs'
import path from 'path'
import {normalizeError} from '@/utils/helpers'

export function jsonify(data, message) {
    const status = this.statusCode || 200
    assert(status >= 200 && status <= 300, new TypeError(`Invalid response status: ${status}. Please use success status code!`))

    if (_.isString(data) && _.isUndefined(message)) {
        [message, data] = [data, message]
    }
    assert(_.isNil(message) || _.isString(message), new TypeError('"message" must be a string.'))

    const success = true
    if (!_.isString(message)) {
        message = STATUS_DEFAULT_MESSAGE[status] ?? statuses(status)
    }
    return this.json({status, success, message, data})
}

export function sendMail(to, subject, template, data, mailOptions) {
    const templatePath = path.join(VIEW_DIR, template + '.ejs')
    console.log('[MAIL DEBUG] sendMail called:', { to, subject, template, templatePath })
    ejs.renderFile(templatePath, {...this.locals, ...data}, function (err, html) {
        if (err) {
            console.error('[MAIL DEBUG] EJS render error:', err.message)
            const detail = normalizeError(err)
            logger.error({
                message: 'Error rendering email template: ' + template,
                detail,
            })
            return
        }
        console.log('[MAIL DEBUG] EJS rendered OK, sending via mailTransporter...')
        mailTransporter.sendMail(
            {
                ...mailOptions,
                from: `"${MAIL_FROM_NAME}" <${MAIL_FROM_ADDRESS}>`,
                to,
                subject,
                html,
            },
            function (err, result) {
                if (err) {
                    console.error('[MAIL DEBUG] mailTransporter error:', err.message || err)
                    const detail = normalizeError(err)
                    logger.error({
                        message: 'Error sending email to ' + to,
                        detail,
                    })
                    return
                }
                console.log('[MAIL DEBUG] Email sent OK:', result)
            }
        )
    })
}
