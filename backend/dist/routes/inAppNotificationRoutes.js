"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const inAppNotificationController_1 = require("../controllers/inAppNotificationController");
const router = express_1.default.Router();
router.use(authMiddleware_1.protect);
router.get('/', inAppNotificationController_1.getMyNotifications);
router.get('/unread-count', inAppNotificationController_1.getUnreadCount);
router.patch('/read-all', inAppNotificationController_1.markAllAsRead);
router.patch('/:id/read', inAppNotificationController_1.markOneAsRead);
router.delete('/:id', inAppNotificationController_1.deleteNotification);
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
router.delete('/:id', inAppNotificationController_1.deleteNotification);
exports.default = router;
//# sourceMappingURL=inAppNotificationRoutes.js.map