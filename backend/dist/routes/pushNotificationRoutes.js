"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pushNotificationController_1 = require("../controllers/pushNotificationController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
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
router.post('/register', authMiddleware_1.protect, pushNotificationController_1.registerPushToken);
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
router.delete('/remove', authMiddleware_1.protect, pushNotificationController_1.removePushToken);
exports.default = router;
//# sourceMappingURL=pushNotificationRoutes.js.map