"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transactionController_1 = require("../controllers/transactionController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
// Apply protection to all transaction routes
router.use(authMiddleware_1.protect);
/**
 * @swagger
 * /api/transactions/deposit:
 *   post:
 *     summary: Deposit funds into user's wallet
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 5000
 *               description:
 *                 type: string
 *                 example: Weekend savings
 *               cardId:
 *                 type: string
 *                 example: "65f2a12b3c4d5e6f7890abcd"
 *     responses:
 *       201:
 *         description: Deposit successful
 *       400:
 *         description: Invalid amount or wallet not found
 */
router.post('/deposit', transactionController_1.deposit);
/**
 * @swagger
 * /api/transactions/withdraw:
 *   post:
 *     summary: Withdraw funds from user's wallet
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 2000
 *               description:
 *                 type: string
 *                 example: ATM withdrawal
 *               cardId:
 *                 type: string
 *                 example: "65f2a12b3c4d5e6f7890abcd"
 *     responses:
 *       201:
 *         description: Withdrawal successful
 *       400:
 *         description: Insufficient funds or invalid amount
 */
router.post('/withdraw', transactionController_1.withdraw);
/**
 * @swagger
 * /api/transactions/transfer:
 *   post:
 *     summary: Transfer funds to another user
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - receiverAccountNumber
 *               - amount
 *             properties:
 *               receiverAccountNumber:
 *                 type: string
 *                 example: "1234567890"
 *               amount:
 *                 type: number
 *                 example: 1000
 *               description:
 *                 type: string
 *                 example: Lunch payment
 *               cardId:
 *                 type: string
 *                 example: "65f2a12b3c4d5e6f7890abcd"
 *     responses:
 *       201:
 *         description: Transfer successful
 *       400:
 *         description: Insufficient funds, invalid recipient, or self-transfer
 */
router.post('/transfer', transactionController_1.transfer);
/**
 * @swagger
 * /api/transactions/history:
 *   get:
 *     summary: Get current user's transaction history
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of transactions retrieved
 *       401:
 *         description: Not authorized
 */
router.get('/history', transactionController_1.getMyTransactions);
exports.default = router;
//# sourceMappingURL=transactionRoutes.js.map