import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import Wallet from '../models/Wallet';
import { generateAccountNumber } from '../utils/accountNumberGenerator';
import { sendWelcomeEmail, sendLoginOtp } from './notification.service';
import { generalOtp } from '../utils/otp';

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

        // Send welcome email
        try {
            await sendWelcomeEmail(user.email, user.fullName, accountNumber);
        } catch (error) {
            console.error('Failed to send welcome email:', error);
            // Don't throw error, just log it - we don't want to block registration
        }

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

// Login User - Request OTP
export const loginUser = async (loginData: any) => {
    const { identifier, password } = loginData;

    const user = await User.findOne({
        $or: [{ email: identifier }, { phoneNumber: identifier }]
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        throw new Error('Invalid email or password');
    }

    // Generate OTP
    const otp = generalOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to user
    await User.findByIdAndUpdate(user._id, {
        loginOtp: otp,
        loginOtpExpires: otpExpires,
    });

    // Send OTP email
    try {
        await sendLoginOtp(user.email, user.fullName, otp);
    } catch (error) {
        console.error('Failed to send OTP email:', error);
        throw new Error('Failed to send OTP email');
    }

    return {
        _id: user._id.toString(),
        email: user.email,
        message: 'OTP has been sent to your email',
    };
};

// Verify Login OTP and get token
export const verifyLoginOtp = async (userId: string, otp: string) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error('User not found');
    }

    // Check if OTP is valid
    if (!user.loginOtp || user.loginOtp !== otp) {
        throw new Error('Invalid OTP');
    }

    // Check if OTP has expired
    if (!user.loginOtpExpires || new Date() > user.loginOtpExpires) {
        throw new Error('OTP has expired');
    }

    // Clear OTP
    await User.findByIdAndUpdate(userId, {
        loginOtp: null,
        loginOtpExpires: null,
    });

    return {
        _id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        token: generateToken(user._id.toString()),
    };
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
