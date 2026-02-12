import mongoose, { Schema, Document } from 'mongoose';

export enum TransactionType {
    DEPOSIT = 'DEPOSIT',
    WITHDRAW = 'WITHDRAW',
    TRANSFER = 'TRANSFER',
}

export enum TransactionStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
}

export interface ITransaction extends Document {
    senderId?: mongoose.Types.ObjectId;
    receiverId?: mongoose.Types.ObjectId;
    cardId?: mongoose.Types.ObjectId;
    cardLast4?: string;
    amount: number;
    type: TransactionType;
    status: TransactionStatus;
    reference: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const TransactionSchema: Schema = new Schema(
    {
        senderId: { type: Schema.Types.ObjectId, ref: 'User' },
        receiverId: { type: Schema.Types.ObjectId, ref: 'User' },
        cardId: { type: Schema.Types.ObjectId, ref: 'Card' },
        cardLast4: { type: String },
        amount: { type: Number, required: true },
        type: {
            type: String,
            enum: Object.values(TransactionType),
            required: true
        },
        status: {
            type: String,
            enum: Object.values(TransactionStatus),
            default: TransactionStatus.COMPLETED
        },
        reference: { type: String, required: true, unique: true },
        description: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
