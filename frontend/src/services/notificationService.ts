import api from './api';

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
