interface PushNotificationInput {
    userId: string;
    title: string;
    body: string;
    data?: Record<string, any>;
}
/**
 * Send push notification to a user via Expo Push Notification service
 */
export declare const sendPushNotification: (input: PushNotificationInput) => Promise<{
    success: boolean;
    reason: any;
    result?: undefined;
} | {
    success: boolean;
    result: any;
    reason?: undefined;
}>;
/**
 * Send push notifications to multiple users
 */
export declare const sendPushNotificationBatch: (userIds: string[], title: string, body: string, data?: Record<string, any>) => Promise<{
    success: boolean;
    reason: string;
    result?: undefined;
} | {
    success: boolean;
    result: any;
    reason?: undefined;
}>;
/**
 * Update user's push token
 */
export declare const updateUserPushToken: (userId: string, pushToken: string) => Promise<{
    success: boolean;
}>;
/**
 * Remove user's push token (e.g., on logout)
 */
export declare const removeUserPushToken: (userId: string) => Promise<{
    success: boolean;
}>;
export {};
//# sourceMappingURL=pushNotification.service.d.ts.map