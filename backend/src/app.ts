import express, { Express, Request, Response } from 'express';
import cors from 'cors';

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req: Request, res: Response) => {
    res.send('Nexpay Backend API is Running');
});

// Routes (To be imported later)
// app.use('/api/auth', authRoutes);
// app.use('/api/wallet', walletRoutes);
// app.use('/api/transactions', transactionRoutes);

export { app };
