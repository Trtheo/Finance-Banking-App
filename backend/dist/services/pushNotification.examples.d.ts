/**
 * Examples of sending push notifications
 *
 * These examples show how to send push notifications programmatically
 * from your backend code.
 */
/**
 * Example 1: Send a welcome notification to a new user
 */
export declare function sendWelcomeNotification(userId: string, userName: string): Promise<void>;
/**
 * Example 2: Send a payment reminder
 */
export declare function sendPaymentReminder(userId: string, amount: number, dueDate: string): Promise<void>;
/**
 * Example 3: Send a security alert
 */
export declare function sendSecurityAlert(userId: string, action: string): Promise<void>;
/**
 * Example 4: Send low balance warning
 */
export declare function sendLowBalanceWarning(userId: string, balance: number): Promise<void>;
/**
 * Example 5: Send promotional notification
 */
export declare function sendPromotionalNotification(userId: string, offer: string): Promise<void>;
/**
 * Example 6: Send announcement to all users
 */
export declare function sendAnnouncementToAll(userIds: string[], announcement: string): Promise<void>;
/**
 * Example 7: Send card expiry notification
 */
export declare function sendCardExpiryNotification(userId: string, cardLast4: string, expiryDate: string): Promise<void>;
/**
 * Example 8: Send transaction confirmation
 */
export declare function sendTransactionConfirmation(userId: string, amount: number, recipient: string, reference: string): Promise<void>;
/**
 * Example 9: Send scheduled notification
 * (Note: This schedules via backend, not via device)
 */
export declare function scheduleMonthlyStatement(userId: string): Promise<void>;
/**
 * Example 10: Send notification with action buttons (iOS)
 * Note: Requires notification categories to be set up in frontend
 */
export declare function sendNotificationWithActions(userId: string, action: string): Promise<void>;
/**
 * Example usage in a controller:
 */
export declare const exampleUsageInController: (req: any, res: any) => Promise<void>;
/**
 * Example usage in a scheduled job:
 */
export declare const exampleScheduledJob: () => Promise<void>;
/**
 * Example: Advanced notification with retry logic
 */
export declare function sendNotificationWithRetry(userId: string, title: string, body: string, maxRetries?: number): Promise<{
    success: boolean;
    reason: any;
    result?: undefined;
} | {
    success: boolean;
    result: any;
    reason?: undefined;
}>;
//# sourceMappingURL=pushNotification.examples.d.ts.map