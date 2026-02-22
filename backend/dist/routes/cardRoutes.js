"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cardController_1 = require("../controllers/cardController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
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
router.post('/', authMiddleware_1.protect, cardController_1.createCard);
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
router.get('/', authMiddleware_1.protect, cardController_1.getCardsByAccount);
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
router.patch('/:cardId/freeze', authMiddleware_1.protect, cardController_1.freezeCard);
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
router.patch('/:cardId/unfreeze', authMiddleware_1.protect, cardController_1.unfreezeCard);
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
router.delete('/:cardId', authMiddleware_1.protect, cardController_1.deleteCard);
exports.default = router;
//# sourceMappingURL=cardRoutes.js.map