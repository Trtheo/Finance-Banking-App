import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    fullName: string;
    email: string;
    phoneNumber: string;
    passwordHash: string;
    primaryBank: string;
    avatarUrl?: string;
    dateOfBirth?: string;
    city?: string;
    language?: string;
    loginOtp?: string;
    loginOtpExpires?: Date;
    pushToken?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phoneNumber: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        primaryBank: { type: String, required: true },
        avatarUrl: { type: String },
        dateOfBirth: { type: String },
        city: { type: String },
        language: { type: String },
        loginOtp: { type: String, default: null },
        loginOtpExpires: { type: Date, default: null },
        pushToken: { type: String, default: null },
    },
    { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
