export const loginOtpTemplate = (name: string, otp: string) =>
  `<h3>Hello ${name}</h3>
   <p>Your login OTP IS <b>${otp}</b></p>
   <p>It will expire in 10 minutes.</p>
   <br/>
   <b>Finance & Banking App</b>`;
