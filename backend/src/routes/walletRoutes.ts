import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import Wallet from '../models/Wallet';

const router = express.Router();

/**
 * @swagger
 * /api/wallet/me:
 *   get:
 *     summary: Get current user's wallet
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet retrieved successfully
 *       404:
 *         description: Wallet not found
 */
router.get('/me', protect, async (req: any, res) => {
    try {
        const wallet = await Wallet.findOne({ userId: req.user.id });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }
        res.json(wallet);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
