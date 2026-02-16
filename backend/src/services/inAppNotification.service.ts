import Notification, { NotificationType } from '../models/Notification';
import { sendPushNotification } from './pushNotification.service';

interface CreateInAppNotificationInput {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    amount?: number;
    reference?: string;
    cardLast4?: string;
}

export const createInAppNotification = async (input: CreateInAppNotificationInput) => {
    // Create in-app notification
    const notification = await Notification.create({
        userId: input.userId,
        type: input.type,
        title: input.title,
        message: input.message,
        amount: input.amount,
        reference: input.reference,
        cardLast4: input.cardLast4,
    });

    console.log(`📢 In-app notification created for user ${input.userId}`);

    // Send push notification (non-blocking)
    sendPushNotification({
        userId: input.userId,
        title: input.title,
        body: input.message,
        data: {
            type: input.type,
            amount: input.amount,
            reference: input.reference,
            notificationId: notification._id.toString(),
        },
    }).then((result) => {
        if (result.success) {
            console.log('✅ Push notification sent successfully');
        } else {
            console.log(`⚠️ Push notification failed: ${result.reason}`);
        }
    }).catch(err => {
        console.error('❌ Push notification error:', err.message || err);
    });

    return notification;
};

export const getUserNotifications = async (userId: string, limit = 50) => {
    return await Notification.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit);
};

export const getUnreadNotificationCount = async (userId: string) => {
    return await Notification.countDocuments({ userId, isRead: false });
};

export const markNotificationAsRead = async (userId: string, notificationId: string) => {
    return await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { isRead: true },
        { new: true }
    );
};

export const markAllNotificationsAsRead = async (userId: string) => {
    const result = await Notification.updateMany(
        { userId, isRead: false },
        { isRead: true }
    );

    return { updatedCount: result.modifiedCount };
};

export const deleteNotification = async (userId: string, notificationId: string) => {
    return await Notification.findOneAndDelete({ _id: notificationId, userId });
};
