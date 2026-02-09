import express, { Express, Request, Response } from 'express';
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

app.use('/api/auth', authRoutes);
// app.use('/api/wallet', walletRoutes);
// app.use('/api/transactions', transactionRoutes);

export { app };
