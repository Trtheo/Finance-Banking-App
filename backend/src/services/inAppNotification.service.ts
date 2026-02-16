import Notification, { NotificationType } from '../models/Notification';

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
    return await Notification.create({
        userId: input.userId,
        type: input.type,
        title: input.title,
        message: input.message,
        amount: input.amount,
        reference: input.reference,
        cardLast4: input.cardLast4,
    });
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

<<<<<<< HEAD
export const deleteInAppNotification = async (userId: string, notificationId: string) => {
=======
export const deleteNotification = async (userId: string, notificationId: string) => {
>>>>>>> 817bd2c44a150796ad80c54d1be4b265b4fb1957
    return await Notification.findOneAndDelete({ _id: notificationId, userId });
};
