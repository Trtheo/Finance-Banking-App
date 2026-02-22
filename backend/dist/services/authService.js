"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.verifyResetOtp = exports.requestPasswordReset = exports.updateUserProfile = exports.getUserProfile = exports.verifyLoginOtp = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const Wallet_1 = __importDefault(require("../models/Wallet"));
const cardModel_1 = __importDefault(require("../models/cardModel"));
const accountNumberGenerator_1 = require("../utils/accountNumberGenerator");
const notification_service_1 = require("./notification.service");
const otp_1 = require("../utils/otp");
// Generate JWT
const generateToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};
const generateCardNumber = () => Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');
const generateCVV = () => Math.floor(100 + Math.random() * 900).toString();
const generateUniqueCardNumber = async () => {
    let cardNumber = generateCardNumber();
    while (await cardModel_1.default.exists({ cardNumber })) {
        cardNumber = generateCardNumber();
    }
    return cardNumber;
};
// Register User
const registerUser = async (userData) => {
    const { fullName, email, phoneNumber, password, bank } = userData;
    // Check if user exists
    const userExists = await User_1.default.findOne({ $or: [{ email }, { phoneNumber }] });
    if (userExists) {
        throw new Error('User already exists with this email or phone number');
    }
    // Hash password
    const salt = await bcryptjs_1.default.genSalt(10);
    const hashedPassword = await bcryptjs_1.default.hash(password, salt);
    // Create user
    const user = await User_1.default.create({
        fullName,
        email,
        phoneNumber,
        passwordHash: hashedPassword,
        primaryBank: bank,
    });
    if (user) {
        // Create Wallet for the user
        const accountNumber = (0, accountNumberGenerator_1.generateAccountNumber)();
        const wallet = await Wallet_1.default.create({
            userId: user._id.toString(),
            accountNumber,
            balance: 0,
            currency: 'RWF',
        });
        // Create default Platinum card for the new account
        const defaultCardNumber = await generateUniqueCardNumber();
        await cardModel_1.default.create({
            cardNumber: defaultCardNumber,
            cvv: generateCVV(),
            expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 5)),
            cardHolderName: user.fullName,
            walletId: wallet._id,
            cardType: 'debit',
            cardTier: 'PLATINUM',
            balance: 0,
            isDefault: true,
        });
        // Send welcome email in the background (non-blocking)
        (0, notification_service_1.sendWelcomeEmail)(user.email, user.fullName, accountNumber)
            .catch((error) => {
            console.error('⚠️  Welcome email failed (non-critical):', error.message);
        });
        // Generate OTP for verification
        const otp = (0, otp_1.generalOtp)();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await User_1.default.findByIdAndUpdate(user._id, {
            loginOtp: otp,
            loginOtpExpires: otpExpires,
        });
        console.log('\n' + '='.repeat(50));
        console.log(`🔥 [DEV] REGISTRATION OTP: ${otp} 🔥`);
        console.log(`For user: ${user.email}`);
        console.log('='.repeat(50) + '\n');
        (0, notification_service_1.sendLoginOtp)(user.email, user.fullName, otp)
            .catch((error) => {
            console.error('⚠️  OTP email failed (still saved in DB):', error.message);
        });
        return {
            _id: user._id.toString(),
            email: user.email,
            fullName: user.fullName,
            message: 'Registration successful! OTP sent to your email.',
        };
    }
    else {
        throw new Error('Invalid user data');
    }
};
exports.registerUser = registerUser;
// Login User - Request OTP
const loginUser = async (loginData) => {
    const { identifier, password } = loginData;
    const user = await User_1.default.findOne({
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
    const isPasswordValid = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }
    // Generate OTP
    const otp = (0, otp_1.generalOtp)();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    // Save OTP to user
    await User_1.default.findByIdAndUpdate(user._id, {
        loginOtp: otp,
        loginOtpExpires: otpExpires,
    });
    // Send OTP email in the background (non-blocking)
    // Don't await or throw - we want login to succeed even if email fails
    console.log('\n' + '='.repeat(50));
    console.log(`🔥 [DEV] YOUR OTP IS: ${otp} 🔥`);
    console.log(`For user: ${user.email}`);
    console.log('='.repeat(50) + '\n');
    (0, notification_service_1.sendLoginOtp)(user.email, user.fullName, otp)
        .catch((error) => {
        console.error('⚠️  OTP email failed (still saved in DB):', error.message);
        // Email failed but OTP is saved in database for verification
    });
    // Return immediately with OTP info
    const response = {
        _id: user._id.toString(),
        email: user.email,
        message: 'OTP sent to your email. Please check spam folder if not received.',
        success: true,
    };
    // Add test OTP in development mode only
    if (process.env.NODE_ENV === 'development') {
        response.testOtp = otp; // For local testing only
    }
    return response;
};
exports.loginUser = loginUser;
// Verify Login OTP and get token
const verifyLoginOtp = async (userId, otp) => {
    const user = await User_1.default.findById(userId);
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
    await User_1.default.findByIdAndUpdate(userId, {
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
exports.verifyLoginOtp = verifyLoginOtp;
// Get User Profile
const getUserProfile = async (userId) => {
    const user = await User_1.default.findById(userId).select('-passwordHash');
    if (user) {
        return user;
    }
    else {
        throw new Error('User not found');
    }
};
exports.getUserProfile = getUserProfile;
// Update User Profile
const updateUserProfile = async (userId, updateData) => {
    const user = await User_1.default.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    // Update fields if provided
    if (updateData.fullName)
        user.fullName = updateData.fullName;
    if (updateData.email)
        user.email = updateData.email;
    if (updateData.phone)
        user.phoneNumber = updateData.phone;
    if (updateData.dateOfBirth)
        user.dateOfBirth = updateData.dateOfBirth;
    if (updateData.city)
        user.city = updateData.city;
    if (updateData.language)
        user.language = updateData.language;
    const updatedUser = await user.save();
    return updatedUser;
};
exports.updateUserProfile = updateUserProfile;
// Request Password Reset
const requestPasswordReset = async (email) => {
    const user = await User_1.default.findOne({ email });
    if (!user) {
        throw new Error('No account found with this email');
    }
    const otp = (0, otp_1.generalOtp)();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await User_1.default.findByIdAndUpdate(user._id, {
        resetPasswordOtp: otp,
        resetPasswordOtpExpires: otpExpires,
    });
    console.log('\n' + '='.repeat(50));
    console.log(`🔥 [DEV] PASSWORD RESET OTP: ${otp} 🔥`);
    console.log(`For user: ${user.email}`);
    console.log('='.repeat(50) + '\n');
    (0, notification_service_1.sendLoginOtp)(user.email, user.fullName, otp)
        .catch((error) => {
        console.error('⚠️  OTP email failed (still saved in DB):', error.message);
    });
    return {
        userId: user._id.toString(),
        message: 'OTP sent to your email',
    };
};
exports.requestPasswordReset = requestPasswordReset;
// Verify Reset OTP
const verifyResetOtp = async (userId, otp) => {
    const user = await User_1.default.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    if (!user.resetPasswordOtp || user.resetPasswordOtp !== otp) {
        throw new Error('Invalid OTP');
    }
    if (!user.resetPasswordOtpExpires || new Date() > user.resetPasswordOtpExpires) {
        throw new Error('OTP has expired');
    }
    return true;
};
exports.verifyResetOtp = verifyResetOtp;
// Reset Password
const resetPassword = async (userId, otp, newPassword) => {
    await (0, exports.verifyResetOtp)(userId, otp);
    const salt = await bcryptjs_1.default.genSalt(10);
    const hashedPassword = await bcryptjs_1.default.hash(newPassword, salt);
    await User_1.default.findByIdAndUpdate(userId, {
        passwordHash: hashedPassword,
        resetPasswordOtp: null,
        resetPasswordOtpExpires: null,
    });
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=authService.js.map