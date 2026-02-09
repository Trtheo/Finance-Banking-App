import { Request, Response } from 'express';
import * as authService from '../services/authService';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
    try {
        const user = await authService.registerUser(req.body);
        res.status(201).json(user);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
    try {
        const user = await authService.loginUser(req.body);
        res.json(user);
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: any, res: Response) => {
    try {
        const user = await authService.getUserProfile(req.user.id);
        res.status(200).json(user);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
}
