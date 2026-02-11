import { Request, Response } from 'express';
import Wallet from '../models/Wallet';
import * as transactionService from '../services/transactionService';

export const deposit = async (req: Request, res: Response) => {
    try {
        const { amount, description } = req.body;
        const userId = (req as any).user.id;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        const transaction = await transactionService.createDeposit(userId, parseFloat(amount), description);
        const wallet = await Wallet.findOne({ userId });

        res.json({
            message: 'Deposit successful',
            balance: wallet?.balance ?? 0,
            transaction
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Server error';
        res.status(400).json({ message });
    }
};

export const withdraw = async (req: Request, res: Response) => {
    try {
        const { amount, description } = req.body;
        const userId = (req as any).user.id;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        const transaction = await transactionService.createWithdrawal(userId, parseFloat(amount), description);
        const wallet = await Wallet.findOne({ userId });

        res.json({
            message: 'Withdrawal successful',
            balance: wallet?.balance ?? 0,
            transaction
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Server error';
        res.status(400).json({ message });
    }
};

export const getWallet = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const wallet = await Wallet.findOne({ userId });
        
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }

        res.json(wallet);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
