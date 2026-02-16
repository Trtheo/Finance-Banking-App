import api from './api';

// In-app notification functions
export const getMyNotifications = async (limit = 50) => {
    const response = await api.get('/notifications', {
        params: { limit },
    });
    return response.data;
};

export const getUnreadCount = async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data.unreadCount as number;
};

export const markNotificationAsRead = async (notificationId: string) => {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data;
};

export const markAllNotificationsAsRead = async () => {
    const response = await api.patch('/notifications/read-all');
    return response.data;
};

export const deleteNotification = async (notificationId: string) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
};

// Re-export push notification functions
export {
    registerForPushNotificationsAsync,
    registerPushToken,
    removePushToken,
    addNotificationReceivedListener,
    addNotificationResponseReceivedListener,
    getLastNotificationResponse,
    scheduleLocalNotification,
    getBadgeCount,
    setBadgeCount,
    clearBadgeCount,
} from './pushNotificationService';
