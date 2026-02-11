import mongoose from 'mongoose';
import Transaction, { TransactionType, TransactionStatus } from '../models/Transaction';
import Wallet from '../models/Wallet';
import User from '../models/User';
import { v4 as uuidv4 } from 'uuid';
import { sendTransactionEmail } from './notification.service';

/**
 * Create a deposit transaction
 */
export const createDeposit = async (userId: string, amount: number, description?: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 1. Find user's wallet
        const wallet = await Wallet.findOne({ userId }).session(session);
        if (!wallet) {
            throw new Error('Wallet not found');
        }

        // 2. Update wallet balance
        wallet.balance += amount;
        await wallet.save({ session });

        // 3. Record transaction
        const transaction = await Transaction.create([{
            receiverId: userId,
            amount,
            type: TransactionType.DEPOSIT,
            status: TransactionStatus.COMPLETED,
            reference: `DEP-${uuidv4().substring(0, 8).toUpperCase()}`,
            description: description || 'Deposit'
        }], { session });

        await session.commitTransaction();

        // 4. Send notification (non-blocking)
        const user = await User.findById(userId);
        if (user && transaction[0]) {
            sendTransactionEmail(user.email, user.fullName, amount, TransactionType.DEPOSIT, {
                transactionId: transaction[0].reference
            }).catch(err => console.error('Deposit notification failed:', err.message));
        }

        return transaction[0];
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

/**
 * Create a withdrawal transaction
 */
export const createWithdrawal = async (userId: string, amount: number, description?: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 1. Find user's wallet
        const wallet = await Wallet.findOne({ userId }).session(session);
        if (!wallet) {
            throw new Error('Wallet not found');
        }

        // 2. Check sufficient funds
        if (wallet.balance < amount) {
            throw new Error('Insufficient funds');
        }

        // 3. Update wallet balance
        wallet.balance -= amount;
        await wallet.save({ session });

        // 4. Record transaction
        const transaction = await Transaction.create([{
            senderId: userId,
            amount,
            type: TransactionType.WITHDRAW,
            status: TransactionStatus.COMPLETED,
            reference: `WDL-${uuidv4().substring(0, 8).toUpperCase()}`,
            description: description || 'Withdrawal'
        }], { session });

        await session.commitTransaction();

        // 5. Send notification (non-blocking)
        const user = await User.findById(userId);
        if (user && transaction[0]) {
            sendTransactionEmail(user.email, user.fullName, amount, TransactionType.WITHDRAW, {
                transactionId: transaction[0].reference
            }).catch(err => console.error('Withdrawal notification failed:', err.message));
        }

        return transaction[0];
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

/**
 * Create a transfer transaction
 */
export const createTransfer = async (senderId: string, receiverAccountNumber: string, amount: number, description?: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 1. Find sender wallet
        const senderWallet = await Wallet.findOne({ userId: senderId }).session(session);
        if (!senderWallet) {
            throw new Error('Sender wallet not found');
        }

        // 2. Check sufficient funds
        if (senderWallet.balance < amount) {
            throw new Error('Insufficient funds');
        }

        // 3. Find receiver wallet
        const receiverWallet = await Wallet.findOne({ accountNumber: receiverAccountNumber }).session(session);
        if (!receiverWallet) {
            throw new Error('Recipient account not found');
        }

        if (senderWallet.accountNumber === receiverWallet.accountNumber) {
            throw new Error('Cannot transfer to the same account');
        }

        // 4. Perform balance updates
        senderWallet.balance -= amount;
        await senderWallet.save({ session });

        receiverWallet.balance += amount;
        await receiverWallet.save({ session });

        // 5. Record transaction
        const transaction = await Transaction.create([{
            senderId,
            receiverId: receiverWallet.userId,
            amount,
            type: TransactionType.TRANSFER,
            status: TransactionStatus.COMPLETED,
            reference: `TRF-${uuidv4().substring(0, 8).toUpperCase()}`,
            description: description || `Transfer to ${receiverAccountNumber}`
        }], { session });

        await session.commitTransaction();

        // 6. Send notifications (non-blocking)
        const [sender, receiver] = await Promise.all([
            User.findById(senderId),
            User.findById(receiverWallet.userId)
        ]);

        if (sender && transaction[0]) {
            sendTransactionEmail(sender.email, sender.fullName, amount, TransactionType.TRANSFER, {
                transactionId: transaction[0].reference,
                accountNumber: receiverAccountNumber,
                recipient: receiver?.fullName || 'Recipient'
            }).catch(err => console.error('Transfer sender notification failed:', err.message));
        }

        if (receiver && transaction[0]) {
            sendTransactionEmail(receiver.email, receiver.fullName, amount, TransactionType.DEPOSIT, {
                transactionId: transaction[0].reference,
                accountNumber: senderWallet.accountNumber,
                recipient: sender?.fullName || 'Sender'
            }).catch(err => console.error('Transfer receiver notification failed:', err.message));
        }

        return transaction[0];
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

/**
 * Get transaction history for a user
 */
export const getTransactionHistory = async (userId: string) => {
    return await Transaction.find({
        $or: [{ senderId: userId }, { receiverId: userId }]
    }).sort({ createdAt: -1 });
};
