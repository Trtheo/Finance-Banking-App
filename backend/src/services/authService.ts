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

        // Send welcome email in the background (non-blocking)
        sendWelcomeEmail(user.email, user.fullName, accountNumber)
            .catch((error) => {
                console.error('⚠️  Welcome email failed (non-critical):', error.message);
                // Don't propagate error - email is not critical for registration
            });

        return {
            _id: user._id.toString(),
            fullName: user.fullName,
            email: user.email,
            token: generateToken(user._id.toString()),
            message: 'Registration successful! Welcome email may take a moment to arrive.',
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

    if (!user) {
        throw new Error('Invalid email or password');
    }

    // Check if user has a password hash (account might be corrupted)
    if (!user.passwordHash) {
        throw new Error('Account is incomplete. Please register again or contact support.');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
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

    // Send OTP email in the background (non-blocking)
    // Don't await or throw - we want login to succeed even if email fails
    sendLoginOtp(user.email, user.fullName, otp)
        .catch((error) => {
            console.error('⚠️  OTP email failed (still saved in DB):', error.message);
            // Email failed but OTP is saved in database for verification
        });

    // Return immediately with OTP info
    const response: any = {
        _id: user._id.toString(),
        email: user.email,
        message: 'OTP sent to your email. Please check spam folder if not received.',
        success: true,
    };

    // Add test OTP in development mode only
    if (process.env.NODE_ENV !== 'production') {
        response.testOtp = otp; // For local testing only
    }

    return response;
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
