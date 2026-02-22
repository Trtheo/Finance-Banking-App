"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testEmailConnection = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// import SMTPTransport from 'nodemailer/lib/smtp-transport';
// Log email configuration on startup (for debugging)
console.log('=== Email Service Configuration ===');
console.log('Email Host:', process.env.EMAIL_HOST);
console.log('Email Port:', process.env.EMAIL_PORT);
console.log('Email User:', process.env.EMAIL_USER);
console.log('Email Password:', process.env.EMAIL_PASS ? '***' : 'NOT SET');
console.log('===================================\n');
// Create transporter with explicit SMTPTransport options
// const transporter: Transporter<SMTPTransport.SentMessageInfo> = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,                    // SMTP host
//   port: Number(process.env.EMAIL_PORT) || 465,     // Gmail SSL port (465)
//   secure: true,  // true for SSL (port 465)
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
//   tls: {
//     rejectUnauthorized: false, // Allow self-signed certificates
//     minVersion: 'TLSv1.2', // Use modern TLS
//   },
//   family: 4, // force IPv4 (avoids ENETUNREACH on Render)
//   connectionTimeout: 15000,
//   socketTimeout: 15000,
//   debug: true, // Enable debug logs
//   logger: true, // Log SMTP traffic
// } as SMTPTransport.Options); // Cast object to SMTPTransport.Options
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    tls: {
        // ciphers:"SSLv3",
        rejectUnauthorized: false
    },
    port: 465,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});
// Verify transporter connection
transporter.verify((error, success) => {
    if (error) {
        console.error('Email transporter verification failed:', error.message);
    }
    else {
        console.log('Email transporter is ready to send messages');
    }
});
// Send email function
const sendEmail = async (to, subject, html) => {
    try {
        console.log(`\n📧 Attempting to send email to: ${to}`);
        console.log(`Subject: ${subject}`);
        const result = await transporter.sendMail({
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to,
            subject,
            html,
        });
        console.log(`✅ Email sent successfully to ${to}`);
        console.log(`Message ID: ${result.messageId}`);
        return result;
    }
    catch (error) {
        console.error(`❌ Error sending email to ${to}:`);
        console.error('Error Code:', error.code);
        console.error('Error Message:', error.message);
        console.error('Full Error:', error);
        throw error;
    }
};
exports.sendEmail = sendEmail;
// Test email function
const testEmailConnection = async (testEmail) => {
    try {
        const result = await (0, exports.sendEmail)(testEmail, 'Test Email - Finance Banking App', `
        <h2>Test Email</h2>
        <p>If you received this email, the email service is working correctly!</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      `);
        return { success: true, messageId: result.messageId };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
};
exports.testEmailConnection = testEmailConnection;
//# sourceMappingURL=email.service.js.map