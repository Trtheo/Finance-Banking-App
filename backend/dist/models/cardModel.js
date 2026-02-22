"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const cardSchema = new mongoose_1.default.Schema({
    cardNumber: { type: String, required: true, unique: true },
    cardHolderName: { type: String, required: true },
    cvv: { type: String, required: true },
    expiryDate: { type: Date, required: true },
    status: { type: String, enum: ['active', 'blocked'], default: 'active' },
    walletId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Wallet', required: true },
    cardType: { type: String, enum: ['debit', 'credit', 'prepaid'], default: 'debit' },
    cardTier: { type: String, enum: ['PLATINUM', 'GOLD'], default: 'PLATINUM' },
    network: { type: String, enum: ['Visa', 'Mastercard'], default: 'Visa' },
    balance: { type: Number, default: 0 },
    isDefault: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});
exports.default = mongoose_1.default.model('Card', cardSchema);
//# sourceMappingURL=cardModel.js.map