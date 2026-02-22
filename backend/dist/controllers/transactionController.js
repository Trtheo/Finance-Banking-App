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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyTransactions = exports.transfer = exports.withdraw = exports.deposit = void 0;
const transactionService = __importStar(require("../services/transactionService"));
/**
 * Handle direct deposit
 */
const deposit = async (req, res) => {
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
    }
    catch (error) {
        console.error('❌ Deposit error:', error.message);
        res.status(400).json({ message: error.message });
    }
};
exports.deposit = deposit;
/**
 * Handle withdrawal
 */
const withdraw = async (req, res) => {
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
    }
    catch (error) {
        console.error('❌ Withdrawal error:', error.message);
        res.status(400).json({ message: error.message });
    }
};
exports.withdraw = withdraw;
/**
 * Handle fund transfer
 */
const transfer = async (req, res) => {
    try {
        const { receiverAccountNumber, amount, description, cardId } = req.body;
        const numericAmount = Number(amount);
        if (!receiverAccountNumber || !numericAmount || numericAmount <= 0) {
            return res.status(400).json({ message: 'Receiver account number and valid amount are required' });
        }
        const transaction = await transactionService.createTransfer(req.user.id, receiverAccountNumber, numericAmount, description, cardId);
        res.status(201).json(transaction);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.transfer = transfer;
/**
 * Get current user's transactions
 */
const getMyTransactions = async (req, res) => {
    try {
        const transactions = await transactionService.getTransactionHistory(req.user.id);
        res.status(200).json(transactions);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.getMyTransactions = getMyTransactions;
//# sourceMappingURL=transactionController.js.map