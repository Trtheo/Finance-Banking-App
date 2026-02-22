"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.welcomeTemplate = void 0;
const welcomeTemplate = (name, accountNumber) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Nexpay</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f5f5f5">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:20px 0">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;max-width:100%">
          <tr>
            <td style="background:#1A237E;padding:40px 30px;text-align:center">
              <h1 style="margin:0;color:#fff;font-size:28px">Welcome to Nexpay!</h1>
              <p style="margin:12px 0 0;color:#E8EAF6;font-size:15px">Your account is ready</p>
            </td>
          </tr>
          <tr>
            <td style="padding:35px 30px">
              <p style="margin:0 0 20px;color:#333;font-size:16px">Hi ${name},</p>
              <p style="margin:0 0 25px;color:#666;font-size:14px;line-height:1.6">
                Thank you for joining Nexpay. We're excited to help you manage your finances with ease and security.
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0;border:2px solid #1A237E;border-radius:8px;overflow:hidden">
                <tr>
                  <td style="background:#1A237E;padding:15px;text-align:center">
                    <p style="margin:0 0 5px;color:#E8EAF6;font-size:12px">Your Account Number</p>
                    <p style="margin:0;color:#fff;font-size:24px;font-weight:bold;letter-spacing:2px">${accountNumber}</p>
                  </td>
                </tr>
              </table>
              
              <div style="background:#E8EAF6;border-radius:8px;padding:25px;margin:25px 0">
                <h3 style="margin:0 0 15px;color:#1A237E;font-size:18px">Getting Started</h3>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:10px 0">
                      <span style="display:inline-block;width:28px;height:28px;background:#1A237E;color:#fff;text-align:center;line-height:28px;border-radius:50%;font-weight:bold;margin-right:12px">1</span>
                      <span style="color:#333;font-size:14px;vertical-align:middle">Complete your profile</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0">
                      <span style="display:inline-block;width:28px;height:28px;background:#1A237E;color:#fff;text-align:center;line-height:28px;border-radius:50%;font-weight:bold;margin-right:12px">2</span>
                      <span style="color:#333;font-size:14px;vertical-align:middle">Add your payment methods</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0">
                      <span style="display:inline-block;width:28px;height:28px;background:#1A237E;color:#fff;text-align:center;line-height:28px;border-radius:50%;font-weight:bold;margin-right:12px">3</span>
                      <span style="color:#333;font-size:14px;vertical-align:middle">Start sending and receiving money</span>
                    </td>
                  </tr>
                </table>
              </div>
              
              <h3 style="margin:30px 0 20px;color:#333;font-size:18px;text-align:center">What You Can Do</h3>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding:15px;vertical-align:top">
                    <div style="text-align:center">
                      <div style="width:60px;height:60px;background:#E8EAF6;border-radius:50%;margin:0 auto 12px;display:flex;align-items:center;justify-content:center">
                        <span style="font-size:28px">💸</span>
                      </div>
                      <h4 style="margin:0 0 8px;color:#333;font-size:15px">Send Money</h4>
                      <p style="margin:0;color:#666;font-size:12px;line-height:1.5">Transfer funds instantly</p>
                    </div>
                  </td>
                  <td width="50%" style="padding:15px;vertical-align:top">
                    <div style="text-align:center">
                      <div style="width:60px;height:60px;background:#E8EAF6;border-radius:50%;margin:0 auto 12px">
                        <span style="font-size:28px;line-height:60px">🔒</span>
                      </div>
                      <h4 style="margin:0 0 8px;color:#333;font-size:15px">Stay Secure</h4>
                      <p style="margin:0;color:#666;font-size:12px;line-height:1.5">Bank-level security</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="padding:15px;vertical-align:top">
                    <div style="text-align:center">
                      <div style="width:60px;height:60px;background:#E8EAF6;border-radius:50%;margin:0 auto 12px">
                        <span style="font-size:28px;line-height:60px">📊</span>
                      </div>
                      <h4 style="margin:0 0 8px;color:#333;font-size:15px">Track Spending</h4>
                      <p style="margin:0;color:#666;font-size:12px;line-height:1.5">Monitor your expenses</p>
                    </div>
                  </td>
                  <td width="50%" style="padding:15px;vertical-align:top">
                    <div style="text-align:center">
                      <div style="width:60px;height:60px;background:#E8EAF6;border-radius:50%;margin:0 auto 12px">
                        <span style="font-size:28px;line-height:60px">💳</span>
                      </div>
                      <h4 style="margin:0 0 8px;color:#333;font-size:15px">Pay Bills</h4>
                      <p style="margin:0;color:#666;font-size:12px;line-height:1.5">Easy bill payments</p>
                    </div>
                  </td>
                </tr>
              </table>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0">
                <tr>
                  <td align="center">
                    <a href="#" style="display:inline-block;background:#1A237E;color:#fff;text-decoration:none;padding:14px 35px;border-radius:6px;font-size:15px;font-weight:600">Open App</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background:#f9f9f9;padding:25px;border-top:1px solid #eee">
              <h3 style="margin:0 0 15px;color:#333;font-size:16px;text-align:center">Need Help?</h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="text-align:center;padding:10px">
                    <p style="margin:0 0 5px;color:#333;font-size:13px;font-weight:600">Email</p>
                    <p style="margin:0;color:#1A237E;font-size:12px">support@nexpay.com</p>
                  </td>
                  <td width="50%" style="text-align:center;padding:10px">
                    <p style="margin:0 0 5px;color:#333;font-size:13px;font-weight:600">Phone</p>
                    <p style="margin:0;color:#1A237E;font-size:12px">+250 123 456 789</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background:#1A237E;padding:25px;text-align:center">
              <p style="margin:0 0 10px;color:#E8EAF6;font-size:14px;font-weight:600">Nexpay</p>
              <p style="margin:0;color:#9FA8DA;font-size:12px">© ${new Date().getFullYear()} Nexpay. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
exports.welcomeTemplate = welcomeTemplate;
//# sourceMappingURL=welcome.template.js.map