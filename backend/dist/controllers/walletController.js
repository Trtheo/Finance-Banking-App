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
exports.getWallet = exports.withdraw = exports.deposit = void 0;
const Wallet_1 = __importDefault(require("../models/Wallet"));
const transactionService = __importStar(require("../services/transactionService"));
const deposit = async (req, res) => {
    try {
        const { amount, description, cardId } = req.body;
        const userId = req.user.id;
        const numericAmount = Number(amount);
        if (!numericAmount || numericAmount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }
        const transaction = await transactionService.createDeposit(userId, numericAmount, description, cardId);
        const wallet = await Wallet_1.default.findOne({ userId });
        res.json({
            message: 'Deposit successful',
            balance: wallet?.balance ?? 0,
            transaction
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Server error';
        res.status(400).json({ message });
    }
};
exports.deposit = deposit;
const withdraw = async (req, res) => {
    try {
        const { amount, description } = req.body;
        const userId = req.user.id;
        const numericAmount = Number(amount);
        if (!numericAmount || numericAmount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }
        const transaction = await transactionService.createWithdrawal(userId, numericAmount, description);
        const wallet = await Wallet_1.default.findOne({ userId });
        res.json({
            message: 'Withdrawal successful',
            balance: wallet?.balance ?? 0,
            transaction
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Server error';
        res.status(400).json({ message });
    }
};
exports.withdraw = withdraw;
const getWallet = async (req, res) => {
    try {
        const userId = req.user.id;
        const wallet = await Wallet_1.default.findOne({ userId });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }
        res.json(wallet);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getWallet = getWallet;
//# sourceMappingURL=walletController.js.map