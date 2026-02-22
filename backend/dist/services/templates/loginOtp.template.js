"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginOtpTemplate = void 0;
const loginOtpTemplate = (name, otp) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login Verification</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f5f5f5">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:20px 0">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;max-width:100%">
          <tr>
            <td style="background:#1A237E;padding:30px;text-align:center">
              <h1 style="margin:0;color:#fff;font-size:24px">Nexpay</h1>
              <p style="margin:8px 0 0;color:#E8EAF6;font-size:14px">Secure Login Verification</p>
            </td>
          </tr>
          <tr>
            <td style="padding:30px">
              <p style="margin:0 0 20px;color:#333;font-size:16px">Hi ${name},</p>
              <p style="margin:0 0 20px;color:#666;font-size:14px;line-height:1.6">Here's your verification code to complete your login:</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:25px 0">
                <tr>
                  <td align="center">
                    <div style="background:#1A237E;border-radius:8px;padding:20px;display:inline-block">
                      <span style="color:#fff;font-size:32px;font-weight:bold;letter-spacing:8px">${otp}</span>
                    </div>
                  </td>
                </tr>
              </table>
              <div style="background:#FFF3E0;border-left:4px solid:#FF9800;padding:12px 15px;margin:20px 0;border-radius:4px">
                <p style="margin:0;color:#E65100;font-size:13px">This code expires in 10 minutes. Never share it with anyone.</p>
              </div>
              <p style="margin:20px 0 0;color:#666;font-size:13px">If you didn't request this, please contact support immediately.</p>
            </td>
          </tr>
          <tr>
            <td style="background:#f9f9f9;padding:20px;text-align:center;border-top:1px solid #eee">
              <p style="margin:0;color:#999;font-size:12px">© ${new Date().getFullYear()} Nexpay. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
exports.loginOtpTemplate = loginOtpTemplate;
//# sourceMappingURL=loginOtp.template.js.map