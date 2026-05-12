"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendMail = exports.default = void 0;
var _nodemailer = _interopRequireDefault(require("nodemailer"));
var _constants = require("./constants");
console.log('MAIL CONFIG:', {
  host: _constants.MAIL_HOST,
  port: _constants.MAIL_PORT,
  secure: _constants.MAIL_SECURE || Number(_constants.MAIL_PORT) === 465,
  user: _constants.MAIL_USERNAME
});
const mailTransporter = _nodemailer.default.createTransport({
  host: _constants.MAIL_HOST || 'smtp.gmail.com',
  port: Number(_constants.MAIL_PORT) || 465,
  secure: _constants.MAIL_SECURE || Number(_constants.MAIL_PORT) === 465,
  auth: {
    user: _constants.MAIL_USERNAME,
    pass: _constants.MAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 20000
});
mailTransporter.verify().then(() => {
  console.log('✅ SMTP Server is ready to send emails');
}).catch(error => {
  console.error('❌ SMTP connection error:', error);
});
const sendMail = async ({
  to,
  subject,
  html
}) => {
  try {
    const mailOptions = {
      from: `"${_constants.MAIL_FROM_NAME || 'UniAdmit System'}" <${_constants.MAIL_FROM_ADDRESS || _constants.MAIL_USERNAME}>`,
      to: to,
      subject: subject,
      html: html
    };
    const info = await mailTransporter.sendMail(mailOptions);
    console.log('📧 Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Send mail error:', error);
    throw error;
  }
};
exports.sendMail = sendMail;
var _default = exports.default = mailTransporter;