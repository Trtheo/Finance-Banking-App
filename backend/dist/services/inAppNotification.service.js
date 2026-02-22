"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotification = exports.markAllNotificationsAsRead = exports.markNotificationAsRead = exports.getUnreadNotificationCount = exports.getUserNotifications = exports.createInAppNotification = void 0;
const Notification_1 = __importDefault(require("../models/Notification"));
const pushNotification_service_1 = require("./pushNotification.service");
const createInAppNotification = async (input) => {
    // Create in-app notification
    const notification = await Notification_1.default.create({
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
    (0, pushNotification_service_1.sendPushNotification)({
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
        }
        else {
            console.log(`⚠️ Push notification failed: ${result.reason}`);
        }
    }).catch(err => {
        console.error('❌ Push notification error:', err.message || err);
    });
    return notification;
};
exports.createInAppNotification = createInAppNotification;
const getUserNotifications = async (userId, limit = 50) => {
    return await Notification_1.default.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit);
};
exports.getUserNotifications = getUserNotifications;
const getUnreadNotificationCount = async (userId) => {
    return await Notification_1.default.countDocuments({ userId, isRead: false });
};
exports.getUnreadNotificationCount = getUnreadNotificationCount;
const markNotificationAsRead = async (userId, notificationId) => {
    return await Notification_1.default.findOneAndUpdate({ _id: notificationId, userId }, { isRead: true }, { new: true });
};
exports.markNotificationAsRead = markNotificationAsRead;
const markAllNotificationsAsRead = async (userId) => {
    const result = await Notification_1.default.updateMany({ userId, isRead: false }, { isRead: true });
    return { updatedCount: result.modifiedCount };
};
exports.markAllNotificationsAsRead = markAllNotificationsAsRead;
const deleteNotification = async (userId, notificationId) => {
    return await Notification_1.default.findOneAndDelete({ _id: notificationId, userId });
};
exports.deleteNotification = deleteNotification;
//# sourceMappingURL=inAppNotification.service.js.map