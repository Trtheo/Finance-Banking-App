import { Router } from "express";
import { sendLoginOtp , sendTransactionEmail} from "../services/notification.service";

const router = Router();

// Login OTP
router.post("/login-otp", async (req, res) => {
  const { email, name, otp } = req.body;
  try {
    await sendLoginOtp(email, name, otp);
    res.json({ message: "OTP email sent successfully" });
  } catch (err) {
    console.error("Error sending OTP email:", err);
    res.status(500).json({ 
      message: "Failed to send OTP email",
      error: err instanceof Error ? err.message : "Unknown error"
    });
  }
});


//Transaction alert
router.post("/transaction", async (req, res) => {
  const { email, name, amount, type } = req.body;
  try {
    await sendTransactionEmail(email, name, amount, type);
    res.json({ message: "Transaction email sent successfully" });
  } catch (err) {
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

export default router;
