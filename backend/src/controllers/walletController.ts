import { Request, Response } from 'express';
import Wallet from '../models/Wallet';
import Transaction from '../models/Transaction';

export const deposit = async (req: Request, res: Response) => {
    try {
        const { amount, description } = req.body;
        const userId = (req as any).user.id;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        const wallet = await Wallet.findOne({ userId });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }

        wallet.balance += parseFloat(amount);
        await wallet.save();

        const transaction = new Transaction({
            userId,
            type: 'DEPOSIT',
            amount: parseFloat(amount),
            description: description || 'Deposit',
            status: 'COMPLETED'
        });
        await transaction.save();

        res.json({
            message: 'Deposit successful',
            balance: wallet.balance,
            transaction
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const withdraw = async (req: Request, res: Response) => {
    try {
        const { amount, description } = req.body;
        const userId = (req as any).user.id;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        const wallet = await Wallet.findOne({ userId });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }

        if (wallet.balance < parseFloat(amount)) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        wallet.balance -= parseFloat(amount);
        await wallet.save();

        const transaction = new Transaction({
            userId,
            type: 'WITHDRAWAL',
            amount: parseFloat(amount),
            description: description || 'Withdrawal',
            status: 'COMPLETED'
        });
        await transaction.save();

        res.json({
            message: 'Withdrawal successful',
            balance: wallet.balance,
            transaction
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
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