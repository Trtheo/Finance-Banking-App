import { Response } from 'express';
import * as inAppNotificationService from '../services/inAppNotification.service';

export const getMyNotifications = async (req: any, res: Response) => {
    try {
        const parsedLimit = req.query.limit ? Number(req.query.limit) : 50;
        const limit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 50;
        const notifications = await inAppNotificationService.getUserNotifications(req.user.id, limit);
        res.status(200).json(notifications);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const markOneAsRead = async (req: any, res: Response) => {
    try {
        const updated = await inAppNotificationService.markNotificationAsRead(req.user.id, req.params.id);

        if (!updated) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.status(200).json(updated);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const markAllAsRead = async (req: any, res: Response) => {
    try {
        const result = await inAppNotificationService.markAllNotificationsAsRead(req.user.id);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteNotification = async (req: any, res: Response) => {
    try {
        const deleted = await inAppNotificationService.deleteNotification(req.user.id, req.params.id);
        
        if (!deleted) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        
        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getUnreadCount = async (req: any, res: Response) => {
    try {
        const unreadCount = await inAppNotificationService.getUnreadNotificationCount(req.user.id);
        res.status(200).json({ unreadCount });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
