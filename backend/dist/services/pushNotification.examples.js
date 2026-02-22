"use strict";
/**
 * Examples of sending push notifications
 *
 * These examples show how to send push notifications programmatically
 * from your backend code.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.exampleScheduledJob = exports.exampleUsageInController = void 0;
exports.sendWelcomeNotification = sendWelcomeNotification;
exports.sendPaymentReminder = sendPaymentReminder;
exports.sendSecurityAlert = sendSecurityAlert;
exports.sendLowBalanceWarning = sendLowBalanceWarning;
exports.sendPromotionalNotification = sendPromotionalNotification;
exports.sendAnnouncementToAll = sendAnnouncementToAll;
exports.sendCardExpiryNotification = sendCardExpiryNotification;
exports.sendTransactionConfirmation = sendTransactionConfirmation;
exports.scheduleMonthlyStatement = scheduleMonthlyStatement;
exports.sendNotificationWithActions = sendNotificationWithActions;
exports.sendNotificationWithRetry = sendNotificationWithRetry;
const pushNotification_service_1 = require("../services/pushNotification.service");
/**
 * Example 1: Send a welcome notification to a new user
 */
async function sendWelcomeNotification(userId, userName) {
    await (0, pushNotification_service_1.sendPushNotification)({
        userId,
        title: 'Welcome to Finance Banking! 🎉',
        body: `Hi ${userName}! Your account is ready to use.`,
        data: {
            type: 'WELCOME',
            screen: 'Dashboard',
        },
    });
}
/**
 * Example 2: Send a payment reminder
 */
async function sendPaymentReminder(userId, amount, dueDate) {
    await (0, pushNotification_service_1.sendPushNotification)({
        userId,
        title: 'Payment Reminder',
        body: `Your payment of RWF ${amount.toLocaleString()} is due on ${dueDate}`,
        data: {
            type: 'PAYMENT_REMINDER',
            amount,
            dueDate,
            screen: 'Payments',
        },
    });
}
/**
 * Example 3: Send a security alert
 */
async function sendSecurityAlert(userId, action) {
    await (0, pushNotification_service_1.sendPushNotification)({
        userId,
        title: '🔒 Security Alert',
        body: `${action} detected on your account. If this wasn't you, please contact support.`,
        data: {
            type: 'SECURITY_ALERT',
            action,
            priority: 'high',
        },
    });
}
/**
 * Example 4: Send low balance warning
 */
async function sendLowBalanceWarning(userId, balance) {
    await (0, pushNotification_service_1.sendPushNotification)({
        userId,
        title: 'Low Balance Warning',
        body: `Your account balance is low: RWF ${balance.toLocaleString()}`,
        data: {
            type: 'LOW_BALANCE',
            balance,
            screen: 'Wallet',
        },
    });
}
/**
 * Example 5: Send promotional notification
 */
async function sendPromotionalNotification(userId, offer) {
    await (0, pushNotification_service_1.sendPushNotification)({
        userId,
        title: '🎁 Special Offer Just for You!',
        body: offer,
        data: {
            type: 'PROMOTION',
            screen: 'Offers',
        },
    });
}
/**
 * Example 6: Send announcement to all users
 */
async function sendAnnouncementToAll(userIds, announcement) {
    await (0, pushNotification_service_1.sendPushNotificationBatch)(userIds, '📢 Important Announcement', announcement, {
        type: 'ANNOUNCEMENT',
        screen: 'Home',
    });
}
/**
 * Example 7: Send card expiry notification
 */
async function sendCardExpiryNotification(userId, cardLast4, expiryDate) {
    await (0, pushNotification_service_1.sendPushNotification)({
        userId,
        title: 'Card Expiring Soon',
        body: `Your card ending in ${cardLast4} expires on ${expiryDate}`,
        data: {
            type: 'CARD_EXPIRY',
            cardLast4,
            expiryDate,
            screen: 'Cards',
        },
    });
}
/**
 * Example 8: Send transaction confirmation
 */
async function sendTransactionConfirmation(userId, amount, recipient, reference) {
    await (0, pushNotification_service_1.sendPushNotification)({
        userId,
        title: '✅ Transaction Successful',
        body: `RWF ${amount.toLocaleString()} sent to ${recipient}`,
        data: {
            type: 'TRANSACTION_CONFIRMATION',
            amount,
            recipient,
            reference,
            screen: 'TransactionHistory',
        },
    });
}
/**
 * Example 9: Send scheduled notification
 * (Note: This schedules via backend, not via device)
 */
async function scheduleMonthlyStatement(userId) {
    // This would typically be called by a cron job or scheduled task
    await (0, pushNotification_service_1.sendPushNotification)({
        userId,
        title: '📊 Monthly Statement Ready',
        body: 'Your monthly account statement is now available',
        data: {
            type: 'MONTHLY_STATEMENT',
            screen: 'Statements',
        },
    });
}
/**
 * Example 10: Send notification with action buttons (iOS)
 * Note: Requires notification categories to be set up in frontend
 */
async function sendNotificationWithActions(userId, action) {
    await (0, pushNotification_service_1.sendPushNotification)({
        userId,
        title: 'Action Required',
        body: `Please ${action}`,
        data: {
            type: 'ACTION_REQUIRED',
            action,
            categoryId: 'actions', // Match with frontend category
        },
    });
}
// ============================================
// Usage in your controllers/services
// ============================================
/**
 * Example usage in a controller:
 */
const exampleUsageInController = async (req, res) => {
    const userId = req.user.userId;
    try {
        // Send notification
        await sendWelcomeNotification(userId, req.user.fullName);
        res.status(200).json({
            message: 'Notification sent successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Failed to send notification',
            error: error.message
        });
    }
};
exports.exampleUsageInController = exampleUsageInController;
/**
 * Example usage in a scheduled job:
 */
const exampleScheduledJob = async () => {
    // This could be triggered by a cron job
    const usersWithLowBalance = await findUsersWithLowBalance();
    for (const user of usersWithLowBalance) {
        await sendLowBalanceWarning(user._id.toString(), user.balance);
    }
};
exports.exampleScheduledJob = exampleScheduledJob;
/**
 * Example: Advanced notification with retry logic
 */
async function sendNotificationWithRetry(userId, title, body, maxRetries = 3) {
    let attempts = 0;
    while (attempts < maxRetries) {
        try {
            const result = await (0, pushNotification_service_1.sendPushNotification)({
                userId,
                title,
                body,
                data: { attempt: attempts + 1 },
            });
            if (result.success) {
                console.log(`Notification sent successfully on attempt ${attempts + 1}`);
                return result;
            }
            attempts++;
            if (attempts < maxRetries) {
                // Wait before retrying (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempts)));
            }
        }
        catch (error) {
            attempts++;
            if (attempts >= maxRetries) {
                throw error;
            }
        }
    }
    throw new Error(`Failed to send notification after ${maxRetries} attempts`);
}
// Mock function for example
async function findUsersWithLowBalance() {
    return []; // Replace with actual query
}
//# sourceMappingURL=pushNotification.examples.js.map