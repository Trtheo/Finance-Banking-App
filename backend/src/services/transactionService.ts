import mongoose from 'mongoose';
import Transaction, { TransactionType, TransactionStatus } from '../models/Transaction';
import Wallet from '../models/Wallet';
import Card from '../models/cardModel';
import User from '../models/User';
import { v4 as uuidv4 } from 'uuid';
import { sendTransactionEmail } from './notification.service';
import { createInAppNotification } from './inAppNotification.service';
import { NotificationType } from '../models/Notification';

const formatCurrency = (amount: number) => `RWF ${amount.toLocaleString()}`;
const CARD_WITHDRAWAL_LIMIT = 5_000_000;
const toCardLast4 = (card: any) => {
    const digits = String(card?.cardNumber || '').replace(/\D/g, '');
    return digits.slice(-4) || undefined;
};

const generateCardNumber = () =>
    Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');

const generateCVV = () =>
    Math.floor(100 + Math.random() * 900).toString();

const generateUniqueCardNumber = async (session: mongoose.ClientSession) => {
    let cardNumber = generateCardNumber();
    while (await Card.findOne({ cardNumber }).session(session)) {
        cardNumber = generateCardNumber();
    }
    return cardNumber;
};

const resolveDepositCard = async (
    wallet: any,
    userId: string,
    session: mongoose.ClientSession,
    cardId?: string
) => {
    let targetCard: any = null;

    if (cardId) {
        targetCard = await Card.findOne({ _id: cardId, walletId: wallet._id }).session(session);
        if (!targetCard) {
            throw new Error('Selected card not found');
        }
        return targetCard;
    }

    targetCard = await Card.findOne({ walletId: wallet._id, isDefault: true }).session(session);
    if (!targetCard) {
        targetCard = await Card.findOne({ walletId: wallet._id }).sort({ createdAt: 1 }).session(session);
        if (targetCard) {
            targetCard.isDefault = true;
            await targetCard.save({ session });
        }
    }

    // Backward compatibility for older accounts with no cards yet
    if (!targetCard) {
        const user = await User.findById(userId).session(session);
        targetCard = await Card.create([{
            cardNumber: await generateUniqueCardNumber(session),
            cvv: generateCVV(),
            expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 5)),
            cardHolderName: user?.fullName || 'Nexpay User',
            walletId: wallet._id,
            cardType: 'debit',
            cardTier: 'PLATINUM',
            balance: 0,
            isDefault: true,
        }], { session });
        return targetCard[0];
    }

    return targetCard;
};

const debitFromCards = async (walletId: any, amount: number, session: mongoose.ClientSession) => {
    const cards = await Card.find({ walletId }).sort({ isDefault: -1, createdAt: 1 }).session(session);
    let remaining = amount;
    let firstDebitedCard: any = null;

    for (const card of cards) {
        if (remaining <= 0) break;

        const cardBalance = Number(card.balance || 0);
        if (cardBalance <= 0) continue;

        const debit = Math.min(cardBalance, remaining);
        card.balance = cardBalance - debit;
        remaining -= debit;
        if (!firstDebitedCard && debit > 0) {
            firstDebitedCard = card;
        }
        await card.save({ session });
    }

    return firstDebitedCard;
};

const resolveDebitCard = async (
    walletId: mongoose.Types.ObjectId,
    session: mongoose.ClientSession,
    cardId?: string
) => {
    if (!cardId) return null;

    const selectedCard = await Card.findOne({ _id: cardId, walletId }).session(session);
    if (!selectedCard) {
        throw new Error('Selected card not found');
    }

    if (selectedCard.status === 'blocked') {
        throw new Error('Selected card is frozen');
    }

    return selectedCard;
};

const enforceCardWithdrawalLimit = (amount: number) => {
    if (amount > CARD_WITHDRAWAL_LIMIT) {
        throw new Error(`Maximum withdrawal per card is ${formatCurrency(CARD_WITHDRAWAL_LIMIT)}`);
    }
};

/**
 * Create a deposit transaction
 */
export const createDeposit = async (userId: string, amount: number, description?: string, cardId?: string) => {
    try {
        // 1. Find user's wallet
        const wallet = await Wallet.findOne({ userId });
        if (!wallet) {
            throw new Error('Wallet not found');
        }

        // 2. Find the target card
        let targetCard: any = null;
        if (cardId) {
            targetCard = await Card.findOne({ _id: cardId, walletId: wallet._id });
            if (!targetCard) {
                throw new Error('Selected card not found');
            }
        } else {
            targetCard = await Card.findOne({ walletId: wallet._id, isDefault: true });
            if (!targetCard) {
                targetCard = await Card.findOne({ walletId: wallet._id }).sort({ createdAt: 1 });
            }
            if (!targetCard) {
                const user = await User.findById(userId);
                targetCard = await Card.create({
                    cardNumber: generateCardNumber(),
                    cvv: generateCVV(),
                    expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 5)),
                    cardHolderName: user?.fullName || 'Nexpay User',
                    walletId: wallet._id,
                    cardType: 'debit',
                    cardTier: 'PLATINUM',
                    balance: 0,
                    isDefault: true,
                });
            }
        }

        // 3. Update wallet and card balances
        wallet.balance += amount;
        await wallet.save();

        targetCard.balance = Number(targetCard.balance || 0) + amount;
        await targetCard.save();
        const targetCardLast4 = toCardLast4(targetCard);

        // 4. Record transaction
        const transaction = await Transaction.create({
            receiverId: userId,
            cardId: targetCard._id,
            cardLast4: targetCardLast4,
            amount,
            type: TransactionType.DEPOSIT,
            status: TransactionStatus.COMPLETED,
            reference: `DEP-${uuidv4().substring(0, 8).toUpperCase()}`,
            description: description || `Deposit to card ••••${targetCardLast4 || '0000'}`
        });

        // 5. Send notification (non-blocking)
        const user = await User.findById(userId);
        if (user && transaction) {
            createInAppNotification({
                userId,
                type: NotificationType.DEPOSIT,
                title: 'Deposit successful',
                message: `Your wallet was credited with ${formatCurrency(amount)}${targetCardLast4 ? ` via card ••••${targetCardLast4}.` : '.'}`,
                amount,
                reference: transaction.reference,
                cardLast4: targetCardLast4,
            }).catch(err => console.error('Deposit in-app notification failed:', err.message));

            sendTransactionEmail(user.email, user.fullName, amount, TransactionType.DEPOSIT, {
                transactionId: transaction.reference
            }).catch(err => console.error('Deposit notification failed:', err.message));
        }

        return transaction;
    } catch (error) {
        throw error;
    }
};

/**
 * Create a withdrawal transaction
 */
export const createWithdrawal = async (userId: string, amount: number, description?: string, cardId?: string) => {
    try {
        enforceCardWithdrawalLimit(amount);

        // 1. Find user's wallet
        const wallet = await Wallet.findOne({ userId });
        if (!wallet) {
            throw new Error('Wallet not found');
        }

        // 2. Check sufficient funds
        if (wallet.balance < amount) {
            throw new Error('Insufficient funds');
        }

        // 3. Update wallet balance
        wallet.balance -= amount;
        await wallet.save();

        // Debit selected card or fall back to wallet-wide card sync behavior
        let debitedCard: any = null;
        if (cardId) {
            debitedCard = await Card.findOne({ _id: cardId, walletId: wallet._id });
            if (!debitedCard) {
                throw new Error('Selected card not found');
            }
            if (debitedCard.status === 'blocked') {
                throw new Error('Selected card is frozen');
            }
            const selectedCardBalance = Number(debitedCard.balance || 0);
            if (selectedCardBalance < amount) {
                throw new Error('Insufficient funds on selected card');
            }
            debitedCard.balance = selectedCardBalance - amount;
            await debitedCard.save();
        } else {
            const cards = await Card.find({ walletId: wallet._id }).sort({ isDefault: -1, createdAt: 1 });
            let remaining = amount;
            for (const card of cards) {
                if (remaining <= 0) break;
                const cardBalance = Number(card.balance || 0);
                if (cardBalance <= 0) continue;
                const debit = Math.min(cardBalance, remaining);
                card.balance = cardBalance - debit;
                remaining -= debit;
                if (!debitedCard && debit > 0) {
                    debitedCard = card;
                }
                await card.save();
            }
        }
        const debitedCardLast4 = toCardLast4(debitedCard);

        // 4. Record transaction
        const transaction = await Transaction.create({
            senderId: userId,
            cardId: debitedCard?._id,
            cardLast4: debitedCardLast4,
            amount,
            type: TransactionType.WITHDRAW,
            status: TransactionStatus.COMPLETED,
            reference: `WDL-${uuidv4().substring(0, 8).toUpperCase()}`,
            description: description || `Withdrawal${debitedCardLast4 ? ` using card ••••${debitedCardLast4}` : ''}`
        });

        // 5. Send notification (non-blocking)
        const user = await User.findById(userId);
        if (user && transaction) {
            createInAppNotification({
                userId,
                type: NotificationType.WITHDRAW,
                title: 'Withdrawal successful',
                message: `${formatCurrency(amount)} was debited from your wallet${debitedCardLast4 ? ` using card ••••${debitedCardLast4}` : ''}.`,
                amount,
                reference: transaction.reference,
                cardLast4: debitedCardLast4,
            }).catch(err => console.error('Withdrawal in-app notification failed:', err.message));

            sendTransactionEmail(user.email, user.fullName, amount, TransactionType.WITHDRAW, {
                transactionId: transaction.reference
            }).catch(err => console.error('Withdrawal notification failed:', err.message));
        }

        return transaction;
    } catch (error) {
        throw error;
    }
};

/**
 * Create a transfer transaction
 */
export const createTransfer = async (
    senderId: string,
    receiverAccountNumber: string,
    amount: number,
    description?: string,
    cardId?: string
) => {
    try {
        enforceCardWithdrawalLimit(amount);

        // 1. Find sender wallet
        const senderWallet = await Wallet.findOne({ userId: senderId });
        if (!senderWallet) {
            throw new Error('Sender wallet not found');
        }

        // 2. Check sufficient funds
        if (senderWallet.balance < amount) {
            throw new Error('Insufficient funds');
        }

        // 3. Find receiver wallet
        const receiverWallet = await Wallet.findOne({ accountNumber: receiverAccountNumber });
        if (!receiverWallet) {
            throw new Error('Recipient account not found');
        }

        if (senderWallet.accountNumber === receiverWallet.accountNumber) {
            throw new Error('Cannot transfer to the same account');
        }

        // 4. Perform balance updates
        senderWallet.balance -= amount;
        await senderWallet.save();

        receiverWallet.balance += amount;
        await receiverWallet.save();

        // Debit selected card if provided, otherwise debit across cards
        let debitedCard: any = null;
        if (cardId) {
            debitedCard = await Card.findOne({ _id: cardId, walletId: senderWallet._id });
            if (!debitedCard) {
                throw new Error('Selected card not found');
            }
            if (debitedCard.status === 'blocked') {
                throw new Error('Selected card is frozen');
            }
            const selectedCardBalance = Number(debitedCard.balance || 0);
            if (selectedCardBalance < amount) {
                throw new Error('Insufficient funds on selected card');
            }
            debitedCard.balance = selectedCardBalance - amount;
            await debitedCard.save();
        } else {
            const cards = await Card.find({ walletId: senderWallet._id }).sort({ isDefault: -1, createdAt: 1 });
            let remaining = amount;
            for (const card of cards) {
                if (remaining <= 0) break;
                const cardBalance = Number(card.balance || 0);
                if (cardBalance <= 0) continue;
                const debit = Math.min(cardBalance, remaining);
                card.balance = cardBalance - debit;
                remaining -= debit;
                if (!debitedCard && debit > 0) {
                    debitedCard = card;
                }
                await card.save();
            }
        }
        const debitedCardLast4 = toCardLast4(debitedCard);

        // Credit receiver's default card
        let receiverCard = await Card.findOne({ walletId: receiverWallet._id, isDefault: true });
        if (!receiverCard) {
            receiverCard = await Card.findOne({ walletId: receiverWallet._id }).sort({ createdAt: 1 });
        }
        if (receiverCard) {
            receiverCard.balance = Number(receiverCard.balance || 0) + amount;
            await receiverCard.save();
        }
        const receiverCardLast4 = toCardLast4(receiverCard);

        // 5. Record transaction
        const transaction = await Transaction.create({
            senderId,
            receiverId: receiverWallet.userId,
            cardId: debitedCard?._id,
            cardLast4: debitedCardLast4,
            amount,
            type: TransactionType.TRANSFER,
            status: TransactionStatus.COMPLETED,
            reference: `TRF-${uuidv4().substring(0, 8).toUpperCase()}`,
            description: description || `Transfer to ${receiverAccountNumber}${debitedCardLast4 ? ` using card ••••${debitedCardLast4}` : ''}`
        });

        // 6. Send notifications (non-blocking)
        const [sender, receiver] = await Promise.all([
            User.findById(senderId),
            User.findById(receiverWallet.userId)
        ]);

        if (sender && transaction) {
            createInAppNotification({
                userId: senderId,
                type: NotificationType.TRANSFER_SENT,
                title: 'Transfer successful',
                message: `You sent ${formatCurrency(amount)} to ${receiver?.fullName || receiverAccountNumber}${debitedCardLast4 ? ` using card ••••${debitedCardLast4}` : ''}.`,
                amount,
                reference: transaction.reference,
                cardLast4: debitedCardLast4,
            }).catch(err => console.error('Transfer sender in-app notification failed:', err.message));

            sendTransactionEmail(sender.email, sender.fullName, amount, TransactionType.TRANSFER, {
                transactionId: transaction.reference,
                accountNumber: receiverAccountNumber,
                recipient: receiver?.fullName || 'Recipient'
            }).catch(err => console.error('Transfer sender notification failed:', err.message));
        }

        if (receiver && transaction) {
            createInAppNotification({
                userId: receiverWallet.userId.toString(),
                type: NotificationType.TRANSFER_RECEIVED,
                title: 'Money received',
                message: `You received ${formatCurrency(amount)} from ${sender?.fullName || 'Sender'}${receiverCardLast4 ? ` into card ••••${receiverCardLast4}` : ''}.`,
                amount,
                reference: transaction.reference,
                cardLast4: receiverCardLast4,
            }).catch(err => console.error('Transfer receiver in-app notification failed:', err.message));

            sendTransactionEmail(receiver.email, receiver.fullName, amount, TransactionType.DEPOSIT, {
                transactionId: transaction.reference,
                accountNumber: senderWallet.accountNumber,
                recipient: sender?.fullName || 'Sender'
            }).catch(err => console.error('Transfer receiver notification failed:', err.message));
        }

        return transaction;
    } catch (error) {
        throw error;
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
