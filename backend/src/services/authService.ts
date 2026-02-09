import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import Wallet from '../models/Wallet';
import { generateAccountNumber } from '../utils/accountNumberGenerator';

// Generate JWT
const generateToken = (id: string) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Register User
export const registerUser = async (userData: any) => {
    const { fullName, email, phoneNumber, password, bank } = userData;

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (userExists) {
        throw new Error('User already exists with this email or phone number');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        fullName,
        email,
        phoneNumber,
        passwordHash: hashedPassword,
        primaryBank: bank,
    });

    if (user) {
        // Create Wallet for the user
        const accountNumber = generateAccountNumber();
        await Wallet.create({
            userId: user._id.toString(),
            accountNumber,
            balance: 0,
            currency: 'RWF',
        });

        return {
            _id: user._id.toString(),
            fullName: user.fullName,
            email: user.email,
            token: generateToken(user._id.toString()),
        };
    } else {
        throw new Error('Invalid user data');
    }
};

// Login User
export const loginUser = async (loginData: any) => {
    const { identifier, password } = loginData;

    const user = await User.findOne({
        $or: [{ email: identifier }, { phoneNumber: identifier }]
    });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
        return {
            _id: user._id.toString(),
            fullName: user.fullName,
            email: user.email,
            token: generateToken(user._id.toString()),
        };
    } else {
        throw new Error('Invalid email or password');
    }
};

// Get User Profile
export const getUserProfile = async (userId: string) => {
    const user = await User.findById(userId).select('-passwordHash');
    if (user) {
        return user;
    } else {
        throw new Error('User not found');
    }
};
