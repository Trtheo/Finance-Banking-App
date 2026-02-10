import express, { Express, Request, Response } from 'express';
import { sendLoginOtp, sendTransactionEmail } from './services/notification.service';
import cors from 'cors';

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger Documentation
import { swaggerUi, swaggerSpec } from './config/swagger';
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Basic Route
app.get('/', (req: Request, res: Response) => {
  res.send('Nexpay Backend API is Running');
});

import authRoutes from './routes/authRoutes';
import walletRoutes from './routes/walletRoutes';
import transactionRoutes from './routes/transactionRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/transactions', transactionRoutes);


// Login OTP
app.post("/login-otp", async (req, res) => {
  const { email, name, otp } = req.body;
  try {
    await sendLoginOtp(email, name, otp);
    res.json({ message: "OTP email sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send OTP email" });
  }
});

// Transaction alert
app.post("/transaction", async (req, res) => {
  const { email, name, amount, type } = req.body;
  try {
    await sendTransactionEmail(email, name, amount, type);
    res.json({ message: "Transaction email sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send transaction email" });
  }
});
export { app };
