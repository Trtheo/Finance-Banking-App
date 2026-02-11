// backend/src/controllers/cardController.ts
import { Request, Response } from 'express';
import Card from '../models/cardModel';
import Wallet from '../models/Wallet';

// Utility functions
const generateCardNumber = () =>
    Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');

const generateCVV = () =>
    Math.floor(100 + Math.random() * 900).toString();

// Create a new card
export const createCard = async (req: any, res: Response) => {
    try {
        const userId = req.user.id; // from auth middleware
        const { cardHolderName } = req.body;

        // Find wallet
        const wallet = await Wallet.findOne({ userId });
        if (!wallet) return res.status(404).json({ message: 'Wallet not found' });

        const card = new Card({
            cardNumber: generateCardNumber(),
            cvv: generateCVV(),
            expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 5)),
            cardHolderName,
            walletId: wallet._id,
        });

        await card.save();

        const maskedNumber = '**** **** **** ' + card.cardNumber.slice(-4);
        res.status(201).json({
            message: 'Card created',
            card: { ...card.toObject(), cardNumber: maskedNumber, cvv: undefined },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all cards for logged-in user
export const getCardsByAccount = async (req: any, res: Response) => {
    try {
        const userId = req.user.id;
        const wallet = await Wallet.findOne({ userId });
        if (!wallet) return res.status(404).json({ message: 'Wallet not found' });

        const cards = await Card.find({ walletId: wallet._id });
        const maskedCards = cards.map(card => ({
            ...card.toObject(),
            cardNumber: '**** **** **** ' + card.cardNumber.slice(-4),
            cvv: undefined,
        }));

        res.json(maskedCards);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Freeze card
export const freezeCard = async (req: any, res: Response) => {
    try {
        const { cardId } = req.params;
        const card = await Card.findById(cardId);
        if (!card) return res.status(404).json({ message: 'Card not found' });

        card.status = 'blocked';
        await card.save();
        res.json({ message: 'Card frozen successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Unfreeze card
export const unfreezeCard = async (req: any, res: Response) => {
    try {
        const { cardId } = req.params;
        const card = await Card.findById(cardId);
        if (!card) return res.status(404).json({ message: 'Card not found' });

        card.status = 'active';
        await card.save();
        res.json({ message: 'Card unblocked successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete card
export const deleteCard = async (req: any, res: Response) => {
    try {
        const { cardId } = req.params;
        const card = await Card.findById(cardId);
        if (!card) return res.status(404).json({ message: 'Card not found' });

        await card.deleteOne();
        res.json({ message: 'Card deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
