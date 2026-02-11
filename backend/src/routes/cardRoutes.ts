import { Router } from 'express';
import {
    createCard,
    getCardsByAccount,
    freezeCard,
    unfreezeCard,
    deleteCard
} from '../controllers/cardController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Cards
 *   description: Debit card management
 */

/**
 * @swagger
 * /api/cards:
 *   post:
 *     summary: Create a new debit card for logged-in user
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cardHolderName:
 *                 type: string
 *                 example: Sheba Mugisha
 *     responses:
 *       201:
 *         description: Card created successfully
 */
router.post('/', protect, createCard);

/**
 * @swagger
 * /api/cards:
 *   get:
 *     summary: Get all cards of logged-in user
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of cards
 */
router.get('/', protect, getCardsByAccount);

/**
 * @swagger
 * /api/cards/{cardId}/freeze:
 *   patch:
 *     summary: Freeze a card
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Card frozen
 */
router.patch('/:cardId/freeze', protect, freezeCard);

/**
 * @swagger
 * /api/cards/{cardId}/unfreeze:
 *   patch:
 *     summary: Unfreeze a card
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Card unblocked
 */
router.patch('/:cardId/unfreeze', protect, unfreezeCard);

/**
 * @swagger
 * /api/cards/{cardId}:
 *   delete:
 *     summary: Delete a card
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Card deleted
 */
router.delete('/:cardId', protect, deleteCard);

export default router;
