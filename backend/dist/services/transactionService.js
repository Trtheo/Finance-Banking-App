"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionHistory = exports.createTransfer = exports.createWithdrawal = exports.createDeposit = void 0;
const Transaction_1 = __importStar(require("../models/Transaction"));
const Wallet_1 = __importDefault(require("../models/Wallet"));
const cardModel_1 = __importDefault(require("../models/cardModel"));
const User_1 = __importDefault(require("../models/User"));
const uuid_1 = require("uuid");
const notification_service_1 = require("./notification.service");
const inAppNotification_service_1 = require("./inAppNotification.service");
const Notification_1 = require("../models/Notification");
const formatCurrency = (amount) => `RWF ${amount.toLocaleString()}`;
const CARD_WITHDRAWAL_LIMIT = 5000000;
const toCardLast4 = (card) => {
    const digits = String(card?.cardNumber || '').replace(/\D/g, '');
    return digits.slice(-4) || undefined;
};
const generateCardNumber = () => Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');
const generateCVV = () => Math.floor(100 + Math.random() * 900).toString();
const generateUniqueCardNumber = async (session) => {
    let cardNumber = generateCardNumber();
    while (await cardModel_1.default.findOne({ cardNumber }).session(session)) {
        cardNumber = generateCardNumber();
    }
    return cardNumber;
};
const resolveDepositCard = async (wallet, userId, session, cardId) => {
    let targetCard = null;
    if (cardId) {
        targetCard = await cardModel_1.default.findOne({ _id: cardId, walletId: wallet._id }).session(session);
        if (!targetCard) {
            throw new Error('Selected card not found');
        }
        return targetCard;
    }
    targetCard = await cardModel_1.default.findOne({ walletId: wallet._id, isDefault: true }).session(session);
    if (!targetCard) {
        targetCard = await cardModel_1.default.findOne({ walletId: wallet._id }).sort({ createdAt: 1 }).session(session);
        if (targetCard) {
            targetCard.isDefault = true;
            await targetCard.save({ session });
        }
    }
    // Backward compatibility for older accounts with no cards yet
    if (!targetCard) {
        const user = await User_1.default.findById(userId).session(session);
        targetCard = await cardModel_1.default.create([{
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
const debitFromCards = async (walletId, amount, session) => {
    const cards = await cardModel_1.default.find({ walletId }).sort({ isDefault: -1, createdAt: 1 }).session(session);
    let remaining = amount;
    let firstDebitedCard = null;
    for (const card of cards) {
        if (remaining <= 0)
            break;
        const cardBalance = Number(card.balance || 0);
        if (cardBalance <= 0)
            continue;
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
const resolveDebitCard = async (walletId, session, cardId) => {
    if (!cardId)
        return null;
    const selectedCard = await cardModel_1.default.findOne({ _id: cardId, walletId }).session(session);
    if (!selectedCard) {
        throw new Error('Selected card not found');
    }
    if (selectedCard.status === 'blocked') {
        throw new Error('Selected card is frozen');
    }
    return selectedCard;
};
const enforceCardWithdrawalLimit = (amount) => {
    if (amount > CARD_WITHDRAWAL_LIMIT) {
        throw new Error(`Maximum withdrawal per card is ${formatCurrency(CARD_WITHDRAWAL_LIMIT)}`);
    }
};
/**
 * Create a deposit transaction
 */
const createDeposit = async (userId, amount, description, cardId) => {
    try {
        // 1. Find user's wallet
        const wallet = await Wallet_1.default.findOne({ userId });
        if (!wallet) {
            throw new Error('Wallet not found');
        }
        // 2. Find the target card
        let targetCard = null;
        if (cardId) {
            targetCard = await cardModel_1.default.findOne({ _id: cardId, walletId: wallet._id });
            if (!targetCard) {
                throw new Error('Selected card not found');
            }
        }
        else {
            targetCard = await cardModel_1.default.findOne({ walletId: wallet._id, isDefault: true });
            if (!targetCard) {
                targetCard = await cardModel_1.default.findOne({ walletId: wallet._id }).sort({ createdAt: 1 });
            }
            if (!targetCard) {
                const user = await User_1.default.findById(userId);
                targetCard = await cardModel_1.default.create({
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
        const transaction = await Transaction_1.default.create({
            receiverId: userId,
            cardId: targetCard._id,
            cardLast4: targetCardLast4,
            amount,
            type: Transaction_1.TransactionType.DEPOSIT,
            status: Transaction_1.TransactionStatus.COMPLETED,
            reference: `DEP-${(0, uuid_1.v4)().substring(0, 8).toUpperCase()}`,
            description: description || `Deposit to card ••••${targetCardLast4 || '0000'}`
        });
        // 5. Send notification (non-blocking)
        const user = await User_1.default.findById(userId);
        if (user && transaction) {
            (0, inAppNotification_service_1.createInAppNotification)({
                userId,
                type: Notification_1.NotificationType.DEPOSIT,
                title: 'Deposit successful',
                message: `Your wallet was credited with ${formatCurrency(amount)}${targetCardLast4 ? ` via card ••••${targetCardLast4}.` : '.'}`,
                amount,
                reference: transaction.reference,
                cardLast4: targetCardLast4,
            }).catch(err => console.error('Deposit in-app notification failed:', err.message));
            (0, notification_service_1.sendTransactionEmail)(user.email, user.fullName, amount, Transaction_1.TransactionType.DEPOSIT, {
                transactionId: transaction.reference
            }).catch(err => console.error('Deposit notification failed:', err.message));
        }
        return transaction;
    }
    catch (error) {
        throw error;
    }
};
exports.createDeposit = createDeposit;
/**
 * Create a withdrawal transaction
 */
const createWithdrawal = async (userId, amount, description, cardId) => {
    try {
        enforceCardWithdrawalLimit(amount);
        // 1. Find user's wallet
        const wallet = await Wallet_1.default.findOne({ userId });
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
        let debitedCard = null;
        if (cardId) {
            debitedCard = await cardModel_1.default.findOne({ _id: cardId, walletId: wallet._id });
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
        }
        else {
            const cards = await cardModel_1.default.find({ walletId: wallet._id }).sort({ isDefault: -1, createdAt: 1 });
            let remaining = amount;
            for (const card of cards) {
                if (remaining <= 0)
                    break;
                const cardBalance = Number(card.balance || 0);
                if (cardBalance <= 0)
                    continue;
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
        const transaction = await Transaction_1.default.create({
            senderId: userId,
            cardId: debitedCard?._id,
            cardLast4: debitedCardLast4,
            amount,
            type: Transaction_1.TransactionType.WITHDRAW,
            status: Transaction_1.TransactionStatus.COMPLETED,
            reference: `WDL-${(0, uuid_1.v4)().substring(0, 8).toUpperCase()}`,
            description: description || `Withdrawal${debitedCardLast4 ? ` using card ••••${debitedCardLast4}` : ''}`
        });
        // 5. Send notification (non-blocking)
        const user = await User_1.default.findById(userId);
        if (user && transaction) {
            (0, inAppNotification_service_1.createInAppNotification)({
                userId,
                type: Notification_1.NotificationType.WITHDRAW,
                title: 'Withdrawal successful',
                message: `${formatCurrency(amount)} was debited from your wallet${debitedCardLast4 ? ` using card ••••${debitedCardLast4}` : ''}.`,
                amount,
                reference: transaction.reference,
                cardLast4: debitedCardLast4,
            }).catch(err => console.error('Withdrawal in-app notification failed:', err.message));
            (0, notification_service_1.sendTransactionEmail)(user.email, user.fullName, amount, Transaction_1.TransactionType.WITHDRAW, {
                transactionId: transaction.reference
            }).catch(err => console.error('Withdrawal notification failed:', err.message));
        }
        return transaction;
    }
    catch (error) {
        throw error;
    }
};
exports.createWithdrawal = createWithdrawal;
/**
 * Create a transfer transaction
 */
const createTransfer = async (senderId, receiverAccountNumber, amount, description, cardId) => {
    try {
        enforceCardWithdrawalLimit(amount);
        // 1. Find sender wallet
        const senderWallet = await Wallet_1.default.findOne({ userId: senderId });
        if (!senderWallet) {
            throw new Error('Sender wallet not found');
        }
        // 2. Check sufficient funds
        if (senderWallet.balance < amount) {
            throw new Error('Insufficient funds');
        }
        // 3. Find receiver wallet
        const receiverWallet = await Wallet_1.default.findOne({ accountNumber: receiverAccountNumber });
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
        let debitedCard = null;
        if (cardId) {
            debitedCard = await cardModel_1.default.findOne({ _id: cardId, walletId: senderWallet._id });
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
        }
        else {
            const cards = await cardModel_1.default.find({ walletId: senderWallet._id }).sort({ isDefault: -1, createdAt: 1 });
            let remaining = amount;
            for (const card of cards) {
                if (remaining <= 0)
                    break;
                const cardBalance = Number(card.balance || 0);
                if (cardBalance <= 0)
                    continue;
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
        let receiverCard = await cardModel_1.default.findOne({ walletId: receiverWallet._id, isDefault: true });
        if (!receiverCard) {
            receiverCard = await cardModel_1.default.findOne({ walletId: receiverWallet._id }).sort({ createdAt: 1 });
        }
        if (receiverCard) {
            receiverCard.balance = Number(receiverCard.balance || 0) + amount;
            await receiverCard.save();
        }
        const receiverCardLast4 = toCardLast4(receiverCard);
        // 5. Record transaction
        const transaction = await Transaction_1.default.create({
            senderId,
            receiverId: receiverWallet.userId,
            cardId: debitedCard?._id,
            cardLast4: debitedCardLast4,
            amount,
            type: Transaction_1.TransactionType.TRANSFER,
            status: Transaction_1.TransactionStatus.COMPLETED,
            reference: `TRF-${(0, uuid_1.v4)().substring(0, 8).toUpperCase()}`,
            description: description || `Transfer to ${receiverAccountNumber}${debitedCardLast4 ? ` using card ••••${debitedCardLast4}` : ''}`
        });
        // 6. Send notifications (non-blocking)
        const [sender, receiver] = await Promise.all([
            User_1.default.findById(senderId),
            User_1.default.findById(receiverWallet.userId)
        ]);
        if (sender && transaction) {
            (0, inAppNotification_service_1.createInAppNotification)({
                userId: senderId,
                type: Notification_1.NotificationType.TRANSFER_SENT,
                title: 'Transfer successful',
                message: `You sent ${formatCurrency(amount)} to ${receiver?.fullName || receiverAccountNumber}${debitedCardLast4 ? ` using card ••••${debitedCardLast4}` : ''}.`,
                amount,
                reference: transaction.reference,
                cardLast4: debitedCardLast4,
            }).catch(err => console.error('Transfer sender in-app notification failed:', err.message));
            (0, notification_service_1.sendTransactionEmail)(sender.email, sender.fullName, amount, Transaction_1.TransactionType.TRANSFER, {
                transactionId: transaction.reference,
                accountNumber: receiverAccountNumber,
                recipient: receiver?.fullName || 'Recipient'
            }).catch(err => console.error('Transfer sender notification failed:', err.message));
        }
        if (receiver && transaction) {
            (0, inAppNotification_service_1.createInAppNotification)({
                userId: receiverWallet.userId.toString(),
                type: Notification_1.NotificationType.TRANSFER_RECEIVED,
                title: 'Money received',
                message: `You received ${formatCurrency(amount)} from ${sender?.fullName || 'Sender'}${receiverCardLast4 ? ` into card ••••${receiverCardLast4}` : ''}.`,
                amount,
                reference: transaction.reference,
                cardLast4: receiverCardLast4,
            }).catch(err => console.error('Transfer receiver in-app notification failed:', err.message));
            (0, notification_service_1.sendTransactionEmail)(receiver.email, receiver.fullName, amount, Transaction_1.TransactionType.DEPOSIT, {
                transactionId: transaction.reference,
                accountNumber: senderWallet.accountNumber,
                recipient: sender?.fullName || 'Sender'
            }).catch(err => console.error('Transfer receiver notification failed:', err.message));
        }
        return transaction;
    }
    catch (error) {
        throw error;
    }
};
exports.createTransfer = createTransfer;
/**
 * Get transaction history for a user
 */
const getTransactionHistory = async (userId) => {
    return await Transaction_1.default.find({
        $or: [{ senderId: userId }, { receiverId: userId }]
    }).sort({ createdAt: -1 });
};
exports.getTransactionHistory = getTransactionHistory;
//# sourceMappingURL=transactionService.js.map