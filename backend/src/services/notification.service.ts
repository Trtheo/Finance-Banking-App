import { sendEmail } from "./email.service";
import { loginOtpTemplate } from "./templates/loginOtp.template";
import { transactionTemplate } from "./templates/transaction.template";
// import { generalTemplate } from "./templates/general.template";

export const sendLoginOtp = async (email: string, name: string, otp: string) => {
  const html = loginOtpTemplate(name, otp);
  await sendEmail(email, "Login OTP",html);
};

export const sendTransactionEmail = async (
  email: string,
  name: string,
  amount: number,
  type: "DEPOSIT" | "WITHDRAW" | "TRANSFER"
) => {
  const html = transactionTemplate(name, amount, type);
  await sendEmail(email, "Transaction Alert", html);
};

// export const sendGeneralNotification = async (email: string, subject: string, message: string) => {
//   const html = generalTemplate(subject, message);
//   await sendEmail(email, subject, html);
// };
