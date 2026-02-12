
import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
    cardNumber: { type: String, required: true, unique: true },
    cardHolderName: { type: String, required: true },
    cvv: { type: String, required: true },
    expiryDate: { type: Date, required: true },
    status: { type: String, enum: ['active', 'blocked'], default: 'active' },
    walletId: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet', required: true },
    cardType: { type: String, enum: ['debit', 'credit', 'prepaid'], default: 'debit' },
    cardTier: { type: String, enum: ['PLATINUM', 'GOLD'], default: 'PLATINUM' },
    network: { type: String, enum: ['Visa', 'Mastercard'], default: 'Visa' },
    balance: { type: Number, default: 0 },
    isDefault: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Card', cardSchema);
