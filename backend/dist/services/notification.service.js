"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTransactionEmail = exports.sendWelcomeEmail = exports.sendLoginOtp = void 0;
const email_service_1 = require("./email.service");
const loginOtp_template_1 = require("./templates/loginOtp.template");
const transaction_template_1 = require("./templates/transaction.template");
const welcome_template_1 = require("./templates/welcome.template");
// import { generalTemplate } from "./templates/general.template";
const sendLoginOtp = async (email, name, otp) => {
    const html = (0, loginOtp_template_1.loginOtpTemplate)(name, otp);
    await (0, email_service_1.sendEmail)(email, "Login OTP", html);
};
exports.sendLoginOtp = sendLoginOtp;
const sendWelcomeEmail = async (email, name, accountNumber) => {
    const html = (0, welcome_template_1.welcomeTemplate)(name, accountNumber);
    await (0, email_service_1.sendEmail)(email, "Welcome to Finance Banking App 🎉", html);
};
exports.sendWelcomeEmail = sendWelcomeEmail;
const sendTransactionEmail = async (email, name, amount, type, details) => {
    const html = (0, transaction_template_1.transactionTemplate)(name, amount, type, details);
    await (0, email_service_1.sendEmail)(email, "Transaction Alert", html);
};
exports.sendTransactionEmail = sendTransactionEmail;
// export const sendGeneralNotification = async (email: string, subject: string, message: string) => {
//   const html = generalTemplate(subject, message);
//   await sendEmail(email, subject, html);
// };
//# sourceMappingURL=notification.service.js.map