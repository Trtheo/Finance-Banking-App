import { sendEmail } from "./email.service";
import { loginOtpTemplate } from "./templates/loginOtp.template";
import { transactionTemplate } from "./templates/transaction.template";
import { welcomeTemplate } from "./templates/welcome.template";
// import { generalTemplate } from "./templates/general.template";

export const sendLoginOtp = async (email: string, name: string, otp: string) => {
  const html = loginOtpTemplate(name, otp);
  await sendEmail(email, "Login OTP",html);
};

export const sendWelcomeEmail = async (email: string, name: string, accountNumber: string) => {
  const html = welcomeTemplate(name, accountNumber);
  await sendEmail(email, "Welcome to Finance Banking App 🎉", html);
};

export const sendTransactionEmail = async (
  email: string,
  name: string,
  amount: number,
  type: "DEPOSIT" | "WITHDRAW" | "TRANSFER",
  details?: { transactionId?: string; accountNumber?: string; recipient?: string }
) => {
  const html = transactionTemplate(name, amount, type, details);
  await sendEmail(email, "Transaction Alert", html);
};

// export const sendGeneralNotification = async (email: string, subject: string, message: string) => {
//   const html = generalTemplate(subject, message);
//   await sendEmail(email, subject, html);
// };
