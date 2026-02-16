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

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Delete a notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *       404:
 *         description: Notification not found
 */
router.delete('/:id', deleteNotification);

export default router;
