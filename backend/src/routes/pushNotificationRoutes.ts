import { Router } from 'express';
import { registerPushToken, removePushToken } from '../controllers/pushNotificationController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * /api/push/register:
 *   post:
 *     summary: Register or update push notification token
 *     tags: [Push Notifications]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pushToken
 *             properties:
 *               pushToken:
 *                 type: string
 *                 description: Expo push token
 *     responses:
 *       200:
 *         description: Push token registered successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.post('/register', protect, registerPushToken);

/**
 * @swagger
 * /api/push/remove:
 *   delete:
 *     summary: Remove push notification token
 *     tags: [Push Notifications]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Push token removed successfully
 *       401:
 *         description: Unauthorized
 */
router.delete('/remove', protect, removePushToken);

export default router;
