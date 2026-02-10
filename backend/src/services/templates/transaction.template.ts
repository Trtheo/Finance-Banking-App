interface TransactionDetails {
  name: string;
  amount: number;
  type: "DEPOSIT" | "WITHDRAW" | "TRANSFER";
  transactionId?: string;
  accountNumber?: string;
  date?: string;
  recipient?: string;
}

export const transactionTemplate = (
  name: string,
  amount: number,
  type: "DEPOSIT" | "WITHDRAW" | "TRANSFER",
  details?: { transactionId?: string; accountNumber?: string; recipient?: string }
) => {
  const transactionId = details?.transactionId || `TXN${Date.now()}`;
  const accountNumber = details?.accountNumber || '****';
  const recipient = details?.recipient || 'N/A';
  const date = new Date().toLocaleString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  const typeConfig = {
    DEPOSIT: { color: '#10b981', icon: '💰', label: 'Deposit', bgColor: '#d1fae5' },
    WITHDRAW: { color: '#ef4444', icon: '💳', label: 'Withdrawal', bgColor: '#fee2e2' },
    TRANSFER: { color: '#3b82f6', icon: '🔄', label: 'Transfer', bgColor: '#dbeafe' }
  };
  
  const config = typeConfig[type];
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Transaction Alert</title>
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
              <p style="margin: 10px 0 0; color: #e8e8ff; font-size: 14px;">Transaction Notification</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px; color: #2d3748; font-size: 24px; font-weight: 600;">Hello ${name},</h2>
              
              <p style="margin: 0 0 25px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                A transaction has been processed on your account:
              </p>
              
              <!-- Transaction Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0; border: 2px solid ${config.color}; border-radius: 10px; overflow: hidden;">
                <!-- Transaction Type Header -->
                <tr>
                  <td style="background-color: ${config.bgColor}; padding: 20px; text-align: center; border-bottom: 2px solid ${config.color};">
                    <span style="font-size: 48px;">${config.icon}</span>
                    <h3 style="margin: 10px 0 0; color: ${config.color}; font-size: 20px; font-weight: 600; text-transform: uppercase;">${config.label}</h3>
                  </td>
                </tr>
                
                <!-- Amount -->
                <tr>
                  <td style="padding: 30px; text-align: center; background-color: #fafafa;">
                    <p style="margin: 0 0 10px; color: #718096; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Amount</p>
                    <p style="margin: 0; color: ${config.color}; font-size: 42px; font-weight: 700;">RWF ${amount.toLocaleString()}</p>
                  </td>
                </tr>
                
                <!-- Transaction Details -->
                <tr>
                  <td style="padding: 25px 30px;">
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color: #718096; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">Transaction ID:</td>
                        <td style="color: #2d3748; font-size: 14px; font-weight: 600; text-align: right; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${transactionId}</td>
                      </tr>
                      <tr>
                        <td style="color: #718096; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">Account:</td>
                        <td style="color: #2d3748; font-size: 14px; font-weight: 600; text-align: right; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${accountNumber}</td>
                      </tr>
                      ${type === 'TRANSFER' ? `
                      <tr>
                        <td style="color: #718096; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">Recipient:</td>
                        <td style="color: #2d3748; font-size: 14px; font-weight: 600; text-align: right; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${recipient}</td>
                      </tr>
                      ` : ''}
                      <tr>
                        <td style="color: #718096; font-size: 14px; padding: 8px 0;">Date & Time:</td>
                        <td style="color: #2d3748; font-size: 14px; font-weight: 600; text-align: right; padding: 8px 0;">${date}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Alert Box -->
              <div style="background-color: #fef5e7; border-left: 4px solid #f39c12; padding: 15px 20px; margin: 25px 0; border-radius: 4px;">
                <p style="margin: 0; color: #7d5d0f; font-size: 14px; line-height: 1.6;">
                  ⚠️ <strong>Security Alert:</strong> If you didn't authorize this transaction, please contact our support team immediately.
                </p>
              </div>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0;">
                <tr>
                  <td align="center">
                    <a href="#" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-size: 16px; font-weight: 600;">View Transaction Details</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Support Section -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 25px 30px; border-top: 1px solid #e2e8f0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding-right: 10px;">
                    <p style="margin: 0 0 8px; color: #2d3748; font-size: 14px; font-weight: 600;">📞 Need Help?</p>
                    <p style="margin: 0; color: #718096; font-size: 13px;">Contact: support@financeapp.com</p>
                  </td>
                  <td width="50%" style="padding-left: 10px; text-align: right;">
                    <p style="margin: 0 0 8px; color: #2d3748; font-size: 14px; font-weight: 600;">🔒 Stay Safe</p>
                    <p style="margin: 0; color: #718096; font-size: 13px;">Never share your PIN or OTP</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #2d3748; padding: 30px; text-align: center;">
              <p style="margin: 0 0 10px; color: #a0aec0; font-size: 14px;">Finance Banking App</p>
              <p style="margin: 0 0 15px; color: #718096; font-size: 12px;">Secure • Fast • Reliable</p>
              <p style="margin: 0; color: #4a5568; font-size: 11px;">© ${new Date().getFullYear()} Finance Banking App. All rights reserved.</p>
              <p style="margin: 15px 0 0; color: #4a5568; font-size: 11px;">This is an automated message, please do not reply to this email.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};
