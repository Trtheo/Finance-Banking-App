/**
 * Examples of sending push notifications
 * 
 * These examples show how to send push notifications programmatically
 * from your backend code.
 */

import { 
    sendPushNotification, 
    sendPushNotificationBatch 
} from '../services/pushNotification.service';

/**
 * Example 1: Send a welcome notification to a new user
 */
export async function sendWelcomeNotification(userId: string, userName: string) {
    await sendPushNotification({
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
export async function sendPaymentReminder(userId: string, amount: number, dueDate: string) {
    await sendPushNotification({
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
export async function sendSecurityAlert(userId: string, action: string) {
    await sendPushNotification({
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
export async function sendLowBalanceWarning(userId: string, balance: number) {
    await sendPushNotification({
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
export async function sendPromotionalNotification(userId: string, offer: string) {
    await sendPushNotification({
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
export async function sendAnnouncementToAll(userIds: string[], announcement: string) {
    await sendPushNotificationBatch(
        userIds,
        '📢 Important Announcement',
        announcement,
        {
            type: 'ANNOUNCEMENT',
            screen: 'Home',
        }
    );
}

/**
 * Example 7: Send card expiry notification
 */
export async function sendCardExpiryNotification(
    userId: string,
    cardLast4: string,
    expiryDate: string
) {
    await sendPushNotification({
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
export async function sendTransactionConfirmation(
    userId: string,
    amount: number,
    recipient: string,
    reference: string
) {
    await sendPushNotification({
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
export async function scheduleMonthlyStatement(userId: string) {
    // This would typically be called by a cron job or scheduled task
    await sendPushNotification({
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
export async function sendNotificationWithActions(userId: string, action: string) {
    await sendPushNotification({
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
export const exampleUsageInController = async (req: any, res: any) => {
    const userId = req.user.userId;
    
    try {
        // Send notification
        await sendWelcomeNotification(userId, req.user.fullName);
        
        res.status(200).json({ 
            message: 'Notification sent successfully' 
        });
    } catch (error: any) {
        res.status(500).json({ 
            message: 'Failed to send notification',
            error: error.message 
        });
    }
};

/**
 * Example usage in a scheduled job:
 */
export const exampleScheduledJob = async () => {
    // This could be triggered by a cron job
    const usersWithLowBalance: any[] = await findUsersWithLowBalance();
    
    for (const user of usersWithLowBalance) {
        await sendLowBalanceWarning(user._id.toString(), user.balance);
    }
};

/**
 * Example: Advanced notification with retry logic
 */
export async function sendNotificationWithRetry(
    userId: string,
    title: string,
    body: string,
    maxRetries: number = 3
) {
    let attempts = 0;
    
    while (attempts < maxRetries) {
        try {
            const result = await sendPushNotification({
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
        } catch (error) {
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
