import nodemailer from 'nodemailer';

// Log email configuration on startup (for debugging)
console.log('=== Email Service Configuration ===');
console.log('Email Host:', process.env.EMAIL_HOST);
console.log('Email Port:', process.env.EMAIL_PORT);
console.log('Email User:', process.env.EMAIL_USER);
console.log('Email Password:', process.env.EMAIL_PASS ? '***' : 'NOT SET');
console.log('===================================\n');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    // Add timeout settings
    connectionTimeout: 10000,
    socketTimeout: 10000,
});

// Verify transporter connection
transporter.verify((error, success) => {
    if (error) {
        console.error('Email transporter verification failed:', error.message);
    } else {
        console.log('Email transporter is ready to send messages');
    }
});

export const sendEmail = async (to: string, subject: string, html: string) => {
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
    } catch (error: any) {
        console.error(`❌ Error sending email to ${to}:`);
        console.error('Error Code:', error.code);
        console.error('Error Message:', error.message);
        console.error('Full Error:', error);
        throw error;
    }
};

// Test email function
export const testEmailConnection = async (testEmail: string) => {
    try {
        const result = await sendEmail(
            testEmail,
            'Test Email - Finance Banking App',
            `
            <h2>Test Email</h2>
            <p>If you received this email, the email service is working correctly!</p>
            <p>Timestamp: ${new Date().toISOString()}</p>
            `
        );
        return { success: true, messageId: result.messageId };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

