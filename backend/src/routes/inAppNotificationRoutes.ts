import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import { getMyNotifications, getUnreadCount, markAllAsRead, markOneAsRead, deleteNotification } from '../controllers/inAppNotificationController';

const router = express.Router();

router.use(protect);

router.get('/', getMyNotifications);
router.get('/unread-count', getUnreadCount);
router.patch('/read-all', markAllAsRead);
router.patch('/:id/read', markOneAsRead);
router.delete('/:id', deleteNotification);

export default router;
