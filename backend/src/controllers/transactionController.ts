import { Request, Response } from 'express';
import * as transactionService from '../services/transactionService';

/**
 * Handle direct deposit
 */
export const deposit = async (req: any, res: Response) => {
    try {
        const { amount, description } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        const transaction = await transactionService.createDeposit(req.user.id, amount, description);
        res.status(201).json(transaction);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Handle withdrawal
 */
export const withdraw = async (req: any, res: Response) => {
    try {
        const { amount, description } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        const transaction = await transactionService.createWithdrawal(req.user.id, amount, description);
        res.status(201).json(transaction);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Handle fund transfer
 */
export const transfer = async (req: any, res: Response) => {
    try {
        const { receiverAccountNumber, amount, description } = req.body;
        if (!receiverAccountNumber || !amount || amount <= 0) {
            return res.status(400).json({ message: 'Receiver account number and valid amount are required' });
        }

        const transaction = await transactionService.createTransfer(req.user.id, receiverAccountNumber, amount, description);
        res.status(201).json(transaction);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Get current user's transactions
 */
export const getMyTransactions = async (req: any, res: Response) => {
    try {
        const transactions = await transactionService.getTransactionHistory(req.user.id);
        res.status(200).json(transactions);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
