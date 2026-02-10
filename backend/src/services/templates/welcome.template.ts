export const welcomeTemplate = (
  name: string,
  accountNumber: string
) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Finance Banking App</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 36px; font-weight: 700;">🎉 Welcome!</h1>
              <p style="margin: 15px 0 0; color: #e8e8ff; font-size: 18px;">Your account is ready to go</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 50px 30px;">
              <h2 style="margin: 0 0 20px; color: #2d3748; font-size: 26px; font-weight: 600;">Hello ${name},</h2>
              
              <p style="margin: 0 0 25px; color: #4a5568; font-size: 16px; line-height: 1.8;">
                Thank you for choosing <strong>Finance Banking App</strong>! We're excited to have you on board. 
                Your account has been successfully created and is ready to use.
              </p>
              
              <!-- Account Number Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 35px 0; border: 2px solid #667eea; border-radius: 10px; overflow: hidden;">
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
                    <p style="margin: 0 0 8px; color: #e8e8ff; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Account Number</p>
                    <p style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: 3px; font-family: 'Courier New', monospace;">${accountNumber}</p>
                  </td>
                </tr>
              </table>
              
              <div style="background: linear-gradient(135deg, #f0f4ff 0%, #f8f0ff 100%); border-radius: 10px; padding: 30px; margin: 35px 0;">
                <h3 style="margin: 0 0 20px; color: #667eea; font-size: 20px; font-weight: 600;">✨ What's Next?</h3>
                
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 12px 0;">
                      <span style="display: inline-block; width: 32px; height: 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-align: center; line-height: 32px; border-radius: 50%; font-weight: 600; margin-right: 15px;">1</span>
                      <span style="color: #4a5568; font-size: 15px; vertical-align: middle;"><strong>Verify Your Account:</strong> Complete your profile to unlock all features</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0;">
                      <span style="display: inline-block; width: 32px; height: 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-align: center; line-height: 32px; border-radius: 50%; font-weight: 600; margin-right: 15px;">2</span>
                      <span style="color: #4a5568; font-size: 15px; vertical-align: middle;"><strong>Add Payment Methods:</strong> Link your cards or bank accounts</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0;">
                      <span style="display: inline-block; width: 32px; height: 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-align: center; line-height: 32px; border-radius: 50%; font-weight: 600; margin-right: 15px;">3</span>
                      <span style="color: #4a5568; font-size: 15px; vertical-align: middle;"><strong>Start Transacting:</strong> Send money, pay bills, and manage your wallet</span>
                    </td>
                  </tr>
                </table>
              </div>
              
              <!-- Features Grid -->
              <h3 style="margin: 40px 0 20px; color: #2d3748; font-size: 22px; font-weight: 600; text-align: center;">🚀 Key Features</h3>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0;">
                <tr>
                  <td width="50%" style="padding: 15px; vertical-align: top;">
                    <div style="text-align: center;">
                      <span style="font-size: 40px;">💸</span>
                      <h4 style="margin: 10px 0 8px; color: #2d3748; font-size: 16px; font-weight: 600;">Fast Transfers</h4>
                      <p style="margin: 0; color: #718096; font-size: 13px; line-height: 1.5;">Send money instantly to anyone, anywhere</p>
                    </div>
                  </td>
                  <td width="50%" style="padding: 15px; vertical-align: top;">
                    <div style="text-align: center;">
                      <span style="font-size: 40px;">🔒</span>
                      <h4 style="margin: 10px 0 8px; color: #2d3748; font-size: 16px; font-weight: 600;">Secure</h4>
                      <p style="margin: 0; color: #718096; font-size: 13px; line-height: 1.5;">Bank-level encryption & security</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="padding: 15px; vertical-align: top;">
                    <div style="text-align: center;">
                      <span style="font-size: 40px;">📊</span>
                      <h4 style="margin: 10px 0 8px; color: #2d3748; font-size: 16px; font-weight: 600;">Track Expenses</h4>
                      <p style="margin: 0; color: #718096; font-size: 13px; line-height: 1.5;">Monitor your spending with insights</p>
                    </div>
                  </td>
                  <td width="50%" style="padding: 15px; vertical-align: top;">
                    <div style="text-align: center;">
                      <span style="font-size: 40px;">💳</span>
                      <h4 style="margin: 10px 0 8px; color: #2d3748; font-size: 16px; font-weight: 600;">Pay Bills</h4>
                      <p style="margin: 0; color: #718096; font-size: 13px; line-height: 1.5;">Easy utility and bill payments</p>
                    </div>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 35px 0;">
                <tr>
                  <td align="center">
                    <a href="#" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 45px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">Get Started Now</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Support Section -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; border-top: 1px solid #e2e8f0;">
              <h3 style="margin: 0 0 15px; color: #2d3748; font-size: 18px; font-weight: 600; text-align: center;">Need Help?</h3>
              <p style="margin: 0 0 20px; color: #4a5568; font-size: 14px; text-align: center; line-height: 1.6;">
                Our support team is here to help you 24/7
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="33%" style="text-align: center; padding: 10px;">
                    <p style="margin: 0 0 5px; color: #2d3748; font-size: 14px; font-weight: 600;">📧 Email</p>
                    <p style="margin: 0; color: #667eea; font-size: 13px;">support@financeapp.com</p>
                  </td>
                  <td width="33%" style="text-align: center; padding: 10px;">
                    <p style="margin: 0 0 5px; color: #2d3748; font-size: 14px; font-weight: 600;">📞 Phone</p>
                    <p style="margin: 0; color: #667eea; font-size: 13px;">+250 123 456 789</p>
                  </td>
                  <td width="33%" style="text-align: center; padding: 10px;">
                    <p style="margin: 0 0 5px; color: #2d3748; font-size: 14px; font-weight: 600;">💬 Chat</p>
                    <p style="margin: 0; color: #667eea; font-size: 13px;">Live Chat Available</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #2d3748; padding: 35px 30px; text-align: center;">
              <p style="margin: 0 0 12px; color: #a0aec0; font-size: 16px; font-weight: 600;">Finance Banking App</p>
              <p style="margin: 0 0 20px; color: #718096; font-size: 12px;">Secure • Fast • Reliable</p>
              
              <!-- Social Links -->
              <table cellpadding="0" cellspacing="0" style="margin: 20px auto 0;">
                <tr>
                  <td style="padding: 0 10px;">
                    <a href="#" style="color: #a0aec0; text-decoration: none; font-size: 24px;">📘</a>
                  </td>
                  <td style="padding: 0 10px;">
                    <a href="#" style="color: #a0aec0; text-decoration: none; font-size: 24px;">🐦</a>
                  </td>
                  <td style="padding: 0 10px;">
                    <a href="#" style="color: #a0aec0; text-decoration: none; font-size: 24px;">📷</a>
                  </td>
                  <td style="padding: 0 10px;">
                    <a href="#" style="color: #a0aec0; text-decoration: none; font-size: 24px;">💼</a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 25px 0 0; color: #4a5568; font-size: 11px;">© ${new Date().getFullYear()} Finance Banking App. All rights reserved.</p>
              <p style="margin: 10px 0 0; color: #4a5568; font-size: 11px;">This email was sent to you because you signed up for Finance Banking App.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
