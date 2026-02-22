"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionTemplate = void 0;
const transactionTemplate = (name, amount, type, details) => {
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
        DEPOSIT: { color: '#2E7D32', label: 'Money Received', icon: '↓' },
        WITHDRAW: { color: '#C62828', label: 'Withdrawal', icon: '↑' },
        TRANSFER: { color: '#1976D2', label: 'Transfer Sent', icon: '→' }
    };
    const config = typeConfig[type];
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Transaction Alert</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f5f5f5">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:20px 0">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;max-width:100%">
          <tr>
            <td style="background:#1A237E;padding:30px;text-align:center">
              <h1 style="margin:0;color:#fff;font-size:24px">Nexpay</h1>
              <p style="margin:8px 0 0;color:#E8EAF6;font-size:14px">Transaction Notification</p>
            </td>
          </tr>
          <tr>
            <td style="padding:30px">
              <p style="margin:0 0 20px;color:#333;font-size:16px">Hi ${name},</p>
              <p style="margin:0 0 20px;color:#666;font-size:14px;line-height:1.6">A transaction was completed on your account:</p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:25px 0;border:2px solid ${config.color};border-radius:8px;overflow:hidden">
                <tr>
                  <td style="background:${config.color};padding:15px;text-align:center">
                    <span style="color:#fff;font-size:32px">${config.icon}</span>
                    <h3 style="margin:8px 0 0;color:#fff;font-size:18px">${config.label}</h3>
                  </td>
                </tr>
                <tr>
                  <td style="padding:25px;text-align:center;background:#fafafa">
                    <p style="margin:0 0 8px;color:#666;font-size:13px">Amount</p>
                    <p style="margin:0;color:${config.color};font-size:36px;font-weight:bold">RWF ${amount.toLocaleString()}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px">
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color:#666;font-size:13px;padding:8px 0;border-bottom:1px solid #eee">Transaction ID</td>
                        <td style="color:#333;font-size:13px;font-weight:600;text-align:right;padding:8px 0;border-bottom:1px solid #eee">${transactionId}</td>
                      </tr>
                      <tr>
                        <td style="color:#666;font-size:13px;padding:8px 0;border-bottom:1px solid #eee">Account</td>
                        <td style="color:#333;font-size:13px;font-weight:600;text-align:right;padding:8px 0;border-bottom:1px solid #eee">${accountNumber}</td>
                      </tr>
                      ${type === 'TRANSFER' ? `
                      <tr>
                        <td style="color:#666;font-size:13px;padding:8px 0;border-bottom:1px solid #eee">To</td>
                        <td style="color:#333;font-size:13px;font-weight:600;text-align:right;padding:8px 0;border-bottom:1px solid #eee">${recipient}</td>
                      </tr>
                      ` : ''}
                      <tr>
                        <td style="color:#666;font-size:13px;padding:8px 0">Date</td>
                        <td style="color:#333;font-size:13px;font-weight:600;text-align:right;padding:8px 0">${date}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <div style="background:#FFF3E0;border-left:4px solid #FF9800;padding:12px 15px;margin:20px 0;border-radius:4px">
                <p style="margin:0;color:#E65100;font-size:13px">If you didn't make this transaction, contact us immediately.</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background:#f9f9f9;padding:20px;text-align:center;border-top:1px solid #eee">
              <p style="margin:0 0 5px;color:#666;font-size:13px">Need help? Email support@nexpay.com</p>
              <p style="margin:5px 0 0;color:#999;font-size:12px">© ${new Date().getFullYear()} Nexpay. All rights reserved.</p>
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
exports.transactionTemplate = transactionTemplate;
//# sourceMappingURL=transaction.template.js.map