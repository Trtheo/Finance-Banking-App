"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const email_service_1 = require("./services/email.service");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
exports.app = app;
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
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
};
// Middleware
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
// Request logging middleware
app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.path} - Time: ${new Date().toLocaleTimeString()}`);
    next();
});
// Swagger Documentation
const swagger_1 = require("./config/swagger");
app.use('/api-docs', swagger_1.swaggerUi.serve, swagger_1.swaggerUi.setup(swagger_1.swaggerSpec));
// Health Check Route
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
    });
});
// Diagnostic Route - Check Email Configuration
app.get('/api/system/health', (req, res) => {
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
app.post('/api/system/test-email', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email address is required' });
    }
    try {
        const result = await (0, email_service_1.testEmailConnection)(email);
        res.status(result.success ? 200 : 500).json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});
// Basic Route
app.get('/', (req, res) => {
    res.send('Finance Banking Backend API is Running ✅');
});
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const walletRoutes_1 = __importDefault(require("./routes/walletRoutes"));
const transactionRoutes_1 = __importDefault(require("./routes/transactionRoutes"));
const cardRoutes_1 = __importDefault(require("./routes/cardRoutes"));
const inAppNotificationRoutes_1 = __importDefault(require("./routes/inAppNotificationRoutes"));
const pushNotificationRoutes_1 = __importDefault(require("./routes/pushNotificationRoutes"));
app.use('/api/auth', authRoutes_1.default);
app.use('/api/wallet', walletRoutes_1.default);
app.use('/api/transactions', transactionRoutes_1.default);
app.use('/api/cards', cardRoutes_1.default);
app.use('/api/notifications', inAppNotificationRoutes_1.default);
app.use('/api/push', pushNotificationRoutes_1.default);
//# sourceMappingURL=app.js.map