import { Request, Response } from 'express';
import * as transactionService from '../services/transactionService';

/**
 * Handle direct deposit
 */
export const deposit = async (req: any, res: Response) => {
    try {
        const { amount, description, cardId } = req.body;
        console.log(`💰 Deposit request received - Amount: ${amount}, User: ${req.user.id}`);
        
        const numericAmount = Number(amount);
        if (!numericAmount || numericAmount <= 0) {
            console.log('❌ Invalid amount:', amount);
            return res.status(400).json({ message: 'Invalid amount' });
        }

        console.log('📝 Creating deposit transaction...');
        const transaction = await transactionService.createDeposit(req.user.id, numericAmount, description, cardId);
        console.log('✅ Deposit successful:', transaction._id);
        res.status(201).json(transaction);
    } catch (error: any) {
        console.error('❌ Deposit error:', error.message);
        res.status(400).json({ message: error.message });
    }
};

/**
 * Handle withdrawal
 */
export const withdraw = async (req: any, res: Response) => {
    try {
        const { amount, description, cardId } = req.body;
        console.log(`💵 Withdrawal request received - Amount: ${amount}, User: ${req.user.id}`);
        
        const numericAmount = Number(amount);
        if (!numericAmount || numericAmount <= 0) {
            console.log('❌ Invalid amount:', amount);
            return res.status(400).json({ message: 'Invalid amount' });
        }

        console.log('📝 Creating withdrawal transaction...');
        const transaction = await transactionService.createWithdrawal(req.user.id, numericAmount, description, cardId);
        console.log('✅ Withdrawal successful:', transaction._id);
        res.status(201).json(transaction);
    } catch (error: any) {
        console.error('❌ Withdrawal error:', error.message);
        res.status(400).json({ message: error.message });
    }
};

/**
 * Handle fund transfer
 */
export const transfer = async (req: any, res: Response) => {
    try {
        const { receiverAccountNumber, amount, description, cardId } = req.body;
        const numericAmount = Number(amount);
        if (!receiverAccountNumber || !numericAmount || numericAmount <= 0) {
            return res.status(400).json({ message: 'Receiver account number and valid amount are required' });
        }

        const transaction = await transactionService.createTransfer(
            req.user.id,
            receiverAccountNumber,
            numericAmount,
            description,
            cardId
        );
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
