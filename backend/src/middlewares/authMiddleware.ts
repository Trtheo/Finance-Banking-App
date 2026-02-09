import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Check if JWT_SECRET is defined
            if (!process.env.JWT_SECRET) {
                throw new Error('JWT_SECRET is not defined');
            }

            const jwtSecret: string = process.env.JWT_SECRET;

            // Verify token
            const decoded = jwt.verify(token!, jwtSecret);

            // Add user to request
            req.user = decoded;

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};
