"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_service_1 = require("../services/notification.service");
const router = (0, express_1.Router)();
// Login OTP
router.post("/login-otp", async (req, res) => {
    const { email, name, otp } = req.body;
    try {
        await (0, notification_service_1.sendLoginOtp)(email, name, otp);
        res.json({ message: "OTP email sent successfully" });
    }
    catch (err) {
        console.error("Error sending OTP email:", err);
        res.status(500).json({
            message: "Failed to send OTP email",
            error: err instanceof Error ? err.message : "Unknown error"
        });
    }
});
//Transaction alert
router.post("/transaction", async (req, res) => {
    const { email, name, amount, type, transactionId, accountNumber, recipient } = req.body;
    try {
        const details = { transactionId, accountNumber, recipient };
        await (0, notification_service_1.sendTransactionEmail)(email, name, amount, type, details);
        res.json({ message: "Transaction email sent successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to send transaction email" });
    }
});
// // General notification
// router.post("/general", async (req, res) => {
//   const { email, subject, message } = req.body;
//   try {
//     await sendGeneralNotification(email, subject, message);
//     res.json({ message: "Notification sent successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to send notification" });
//   }
// });
exports.default = router;
//# sourceMappingURL=notification.routes.js.map