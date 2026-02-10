export const loginOtpTemplate = (name: string, otp: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login Verification</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">🏦 Finance Banking App</h1>
              <p style="margin: 10px 0 0; color: #e8e8ff; font-size: 14px;">Secure Banking Platform</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px; color: #2d3748; font-size: 24px; font-weight: 600;">Hello ${name},</h2>
              
              <p style="margin: 0 0 25px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                Your One-Time Password (OTP) for login verification is:
              </p>
              
              <!-- OTP Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; padding: 25px; display: inline-block;">
                      <span style="color: #ffffff; font-size: 36px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</span>
                    </div>
                  </td>
                </tr>
              </table>
              
              <div style="background-color: #fef5e7; border-left: 4px solid #f39c12; padding: 15px 20px; margin: 25px 0; border-radius: 4px;">
                <p style="margin: 0; color: #7d5d0f; font-size: 14px; line-height: 1.6;">
                  ⏱️ <strong>Important:</strong> This OTP will expire in <strong>10 minutes</strong>. Do not share this code with anyone.
                </p>
              </div>
              
              <p style="margin: 25px 0 0; color: #4a5568; font-size: 14px; line-height: 1.6;">
                If you didn't request this code, please ignore this email or contact our support team immediately.
              </p>
            </td>
          </tr>
          
          <!-- Security Notice -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px 30px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #718096; font-size: 13px; line-height: 1.6;">
                🔒 <strong>Security Tip:</strong> We will never ask for your OTP via phone or email. Keep your account secure.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #2d3748; padding: 30px; text-align: center;">
              <p style="margin: 0 0 10px; color: #a0aec0; font-size: 14px;">Finance Banking App</p>
              <p style="margin: 0 0 15px; color: #718096; font-size: 12px;">Secure • Fast • Reliable</p>
              <p style="margin: 0; color: #4a5568; font-size: 11px;">© ${new Date().getFullYear()} Finance Banking App. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
