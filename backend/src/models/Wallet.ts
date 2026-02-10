import mongoose, { Schema, Document } from 'mongoose';

export interface IWallet extends Document {
    userId: mongoose.Types.ObjectId;
    accountNumber: string;
    balance: number;
    currency: string;
    status: 'active' | 'suspended';
    createdAt: Date;
    updatedAt: Date;
}

const WalletSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        accountNumber: { type: String, required: true, unique: true },
        balance: { type: Number, default: 0.0 }, // Initialize with 0 balance
        currency: { type: String, default: 'RWF' },
        status: { type: String, enum: ['active', 'suspended'], default: 'active' },
    },
    { timestamps: true }
);

export default mongoose.model<IWallet>('Wallet', WalletSchema);
