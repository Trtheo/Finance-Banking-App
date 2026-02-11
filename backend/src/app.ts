import express, { Express, Request, Response } from 'express';
import { sendLoginOtp, sendTransactionEmail } from './services/notification.service';
import { testEmailConnection } from './services/email.service';
import cors from 'cors';

const app: Express = express();

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'http://192.168.1.169:3000',
  'http://192.168.1.169:5000',
  'https://banking-mobile-app.onrender.com',
  'https://banking-mobile-app-staging.onrender.com',
];

const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Swagger Documentation
import { swaggerUi, swaggerSpec } from './config/swagger';
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health Check Route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Diagnostic Route - Check Email Configuration
app.get('/api/system/health', (req: Request, res: Response) => {
  const emailConfig = {
    host: process.env.EMAIL_HOST || 'NOT SET',
    port: process.env.EMAIL_PORT || 'NOT SET',
    user: process.env.EMAIL_USER || 'NOT SET',
    hasPassword: !!process.env.EMAIL_PASS,
    hasFrom: !!process.env.EMAIL_FROM,
    mongodbUri: process.env.MONGODB_URI ? 'SET' : 'NOT SET',
    jwtSecret: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
    nodeEnv: process.env.NODE_ENV || 'development',
  };

  res.status(200).json({
    status: 'operational',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    email: emailConfig,
  });
});

// Test Email Route
app.post('/api/system/test-email', async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email address is required' });
  }

  try {
    const result = await testEmailConnection(email);
    res.status(result.success ? 200 : 500).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Basic Route
app.get('/', (req: Request, res: Response) => {
  res.send('Finance Banking Backend API is Running ✅');
});

import authRoutes from './routes/authRoutes';
import walletRoutes from './routes/walletRoutes';
import transactionRoutes from './routes/transactionRoutes';
import cardRoutes from './routes/cardRoutes';
import inAppNotificationRoutes from './routes/inAppNotificationRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/notifications', inAppNotificationRoutes);


export { app };
