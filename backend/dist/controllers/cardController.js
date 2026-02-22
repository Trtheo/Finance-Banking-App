"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCard = exports.unfreezeCard = exports.freezeCard = exports.getCardsByAccount = exports.createCard = void 0;
const cardModel_1 = __importDefault(require("../models/cardModel"));
const Wallet_1 = __importDefault(require("../models/Wallet"));
const generateCardNumber = () => Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');
const generateCVV = () => Math.floor(100 + Math.random() * 900).toString();
const generateUniqueCardNumber = async () => {
    let cardNumber = generateCardNumber();
    while (await cardModel_1.default.exists({ cardNumber })) {
        cardNumber = generateCardNumber();
    }
    return cardNumber;
};
const getWalletByUserId = async (userId) => {
    return await Wallet_1.default.findOne({ userId });
};
const getOwnedCard = async (userId, cardId) => {
    const wallet = await getWalletByUserId(userId);
    if (!wallet)
        return null;
    return await cardModel_1.default.findOne({ _id: cardId, walletId: wallet._id });
};
const toPublicCard = (card) => {
    const cardObj = card.toObject();
    delete cardObj.cvv;
    return cardObj;
};
// Create a new card
const createCard = async (req, res) => {
    try {
        const userId = req.user.id;
        const { cardHolderName } = req.body;
        if (!cardHolderName || String(cardHolderName).trim().length < 2) {
            return res.status(400).json({ message: 'Valid cardHolderName is required' });
        }
        const wallet = await getWalletByUserId(userId);
        if (!wallet)
            return res.status(404).json({ message: 'Wallet not found' });
        const card = new cardModel_1.default({
            cardNumber: await generateUniqueCardNumber(),
            cvv: generateCVV(),
            expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 5)),
            cardHolderName: String(cardHolderName).trim(),
            walletId: wallet._id,
            cardType: 'debit',
            cardTier: 'PLATINUM',
            balance: 0,
            isDefault: false,
        });
        await card.save();
        res.status(201).json({
            message: 'Card created',
            card: toPublicCard(card),
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createCard = createCard;
// Get all cards for logged-in user
const getCardsByAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const wallet = await getWalletByUserId(userId);
        if (!wallet)
            return res.status(404).json({ message: 'Wallet not found' });
        const cards = await cardModel_1.default.find({ walletId: wallet._id }).sort({ isDefault: -1, createdAt: 1 });
        // Backward compatibility: if this account has only one card, keep it aligned with wallet total.
        if (cards.length === 1) {
            const singleCard = cards[0];
            const walletBalance = Number(wallet.balance || 0);
            const cardBalance = Number(singleCard.balance || 0);
            if (Math.abs(walletBalance - cardBalance) > 0.0001) {
                singleCard.balance = walletBalance;
                await singleCard.save();
            }
        }
        res.json(cards.map(toPublicCard));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getCardsByAccount = getCardsByAccount;
// Freeze card
const freezeCard = async (req, res) => {
    try {
        const { cardId } = req.params;
        const card = await getOwnedCard(req.user.id, cardId);
        if (!card)
            return res.status(404).json({ message: 'Card not found' });
        card.status = 'blocked';
        await card.save();
        res.json({ message: 'Card frozen successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.freezeCard = freezeCard;
// Unfreeze card
const unfreezeCard = async (req, res) => {
    try {
        const { cardId } = req.params;
        const card = await getOwnedCard(req.user.id, cardId);
        if (!card)
            return res.status(404).json({ message: 'Card not found' });
        card.status = 'active';
        await card.save();
        res.json({ message: 'Card unblocked successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.unfreezeCard = unfreezeCard;
// Delete card
const deleteCard = async (req, res) => {
    try {
        const { cardId } = req.params;
        const card = await getOwnedCard(req.user.id, cardId);
        if (!card)
            return res.status(404).json({ message: 'Card not found' });
        const cardsCount = await cardModel_1.default.countDocuments({ walletId: card.walletId });
        if (cardsCount <= 1) {
            return res.status(400).json({ message: 'Cannot delete your last card' });
        }
        if (Number(card.balance || 0) > 0) {
            return res.status(400).json({ message: 'Cannot delete a card with balance. Transfer or withdraw first.' });
        }
        const wasDefault = Boolean(card.isDefault);
        const walletId = card.walletId;
        await card.deleteOne();
        if (wasDefault) {
            const nextDefault = await cardModel_1.default.findOne({ walletId }).sort({ createdAt: 1 });
            if (nextDefault) {
                nextDefault.isDefault = true;
                await nextDefault.save();
            }
        }
        res.json({ message: 'Card deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteCard = deleteCard;
//# sourceMappingURL=cardController.js.map