import User from '../models/User';

interface PushNotificationInput {
    userId: string;
    title: string;
    body: string;
    data?: Record<string, any>;
}

interface ExpoPushMessage {
    to: string;
    sound?: string;
    title: string;
    body: string;
    data?: Record<string, any>;
    priority?: 'default' | 'normal' | 'high';
    badge?: number;
}

/**
 * Send push notification to a user via Expo Push Notification service
 */
export const sendPushNotification = async (input: PushNotificationInput) => {
    try {
        // Get user's push token
        const user = await User.findById(input.userId);
        
        if (!user || !user.pushToken) {
            console.log(`⚠️ No push token found for user ${input.userId}`);
            return { success: false, reason: 'No push token' };
        }

        console.log(`📨 Sending push notification to user ${input.userId} with token: ${user.pushToken.substring(0, 30)}...`);

        // Validate Expo push token
        if (!isValidExpoPushToken(user.pushToken)) {
            console.log(`❌ Invalid Expo push token format for user ${input.userId}`);
            return { success: false, reason: 'Invalid push token' };
        }

        // Prepare push message
        const message: ExpoPushMessage = {
            to: user.pushToken,
            sound: 'default',
            title: input.title,
            body: input.body,
            data: input.data || {},
            priority: 'high',
        };

        console.log(`📤 Making request to Expo Push API...`);

        // Send push notification through Expo's API
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });

        const result = await response.json();
        
        console.log(`📥 Expo API Response:`, JSON.stringify(result));

        if (result.data && result.data[0]?.status === 'error') {
            console.error('❌ Expo push error:', result.data[0].message);
            return { success: false, reason: result.data[0].message };
        }

        console.log(`✅ Push notification sent successfully to user ${input.userId}`);
        return { success: true, result };

    } catch (error) {
        console.error('❌ Error sending push notification:', error instanceof Error ? error.message : error);
        return { success: false, reason: error instanceof Error ? error.message : 'Unknown error' };
    }
};

/**
 * Send push notifications to multiple users
 */
export const sendPushNotificationBatch = async (
    userIds: string[],
    title: string,
    body: string,
    data?: Record<string, any>
) => {
    const messages: ExpoPushMessage[] = [];

    // Get all users with push tokens
    const users = await User.find({
        _id: { $in: userIds },
        pushToken: { $exists: true, $ne: null },
    });

    // Prepare messages
    for (const user of users) {
        if (user.pushToken && isValidExpoPushToken(user.pushToken)) {
            messages.push({
                to: user.pushToken,
                sound: 'default',
                title,
                body,
                data: data || {},
                priority: 'high',
            });
        }
    }

    if (messages.length === 0) {
        return { success: false, reason: 'No valid push tokens' };
    }

    try {
        // Send batch push notifications
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messages),
        });

        const result = await response.json();
        console.log(`Batch push notifications sent to ${messages.length} users`);
        return { success: true, result };

    } catch (error) {
        console.error('Error sending batch push notifications:', error);
        return { success: false, reason: error instanceof Error ? error.message : 'Unknown error' };
    }
};

/**
 * Validate if token is a valid Expo push token
 */
const isValidExpoPushToken = (token: string): boolean => {
    return (
        token.startsWith('ExponentPushToken[') ||
        token.startsWith('ExpoPushToken[') ||
        /^[a-zA-Z0-9_-]{22}$/.test(token) // Legacy format
    );
};

/**
 * Update user's push token
 */
export const updateUserPushToken = async (userId: string, pushToken: string) => {
    try {
        console.log(`🔍 Validating push token format...`);
        if (!isValidExpoPushToken(pushToken)) {
            console.log(`❌ Invalid Expo push token format: ${pushToken}`);
            throw new Error('Invalid Expo push token format');
        }

        console.log(`📝 Updating database for user ${userId}...`);
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { pushToken },
            { new: true }
        );

        if (!updatedUser) {
            console.log(`❌ User not found in database: ${userId}`);
            throw new Error(`User not found: ${userId}`);
        }

        console.log(`✅ Push token updated in database for user ${userId}`);
        console.log(`📱 Saved token: ${pushToken.substring(0, 30)}...`);
        return { success: true };
    } catch (error) {
        console.error('❌ Error updating push token:', error instanceof Error ? error.message : error);
        throw error;
    }
};

/**
 * Remove user's push token (e.g., on logout)
 */
export const removeUserPushToken = async (userId: string) => {
    try {
        await User.findByIdAndUpdate(
            userId,
            { pushToken: null },
            { new: true }
        );

        console.log(`Removed push token for user ${userId}`);
        return { success: true };
    } catch (error) {
        console.error('Error removing push token:', error);
        throw error;
    }
};
