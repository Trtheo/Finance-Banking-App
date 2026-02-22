"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePushToken = exports.registerPushToken = void 0;
const pushNotification_service_1 = require("../services/pushNotification.service");
/**
 * Register or update push notification token
 */
const registerPushToken = async (req, res) => {
    try {
        const { pushToken } = req.body;
        const userId = req.user.userId || req.user.id || req.user._id;
        console.log(` Push token registration endpoint called`);
        console.log(` Token: ${pushToken?.substring(0, 30)}...`);
        console.log(` User ID: ${userId}`);
        console.log(` req.user object:`, JSON.stringify(req.user));
        if (!pushToken) {
            console.log('Push token not provided in request body');
            return res.status(400).json({ message: 'Push token is required' });
        }
        if (!userId) {
            console.log(' User ID not found in request');
            return res.status(401).json({ message: 'Unauthorized - User ID not found' });
        }
        console.log(` Saving push token to database for user ${userId}...`);
        await (0, pushNotification_service_1.updateUserPushToken)(userId, pushToken);
        console.log(` Push token saved successfully`);
        return res.status(200).json({
            message: 'Push token registered successfully',
            success: true
        });
    }
    catch (error) {
        console.error(' Error registering push token:', error.message);
        return res.status(500).json({
            message: 'Failed to register push token',
            error: error.message
        });
    }
};
exports.registerPushToken = registerPushToken;
/**
 * Remove push notification token (e.g., on logout)
 */
const removePushToken = async (req, res) => {
    try {
        const userId = req.user.userId;
        await (0, pushNotification_service_1.removeUserPushToken)(userId);
        return res.status(200).json({
            message: 'Push token removed successfully',
            success: true
        });
    }
    catch (error) {
        console.error('Error removing push token:', error);
        return res.status(500).json({
            message: 'Failed to remove push token',
            error: error.message
        });
    }
};
exports.removePushToken = removePushToken;
//# sourceMappingURL=pushNotificationController.js.map