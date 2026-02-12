import mongoose, { Schema, Document } from 'mongoose';

export enum NotificationType {
    DEPOSIT = 'DEPOSIT',
    WITHDRAW = 'WITHDRAW',
    TRANSFER_SENT = 'TRANSFER_SENT',
    TRANSFER_RECEIVED = 'TRANSFER_RECEIVED',
}

export interface INotification extends Document {
    userId: mongoose.Types.ObjectId;
    type: NotificationType;
    title: string;
    message: string;
    amount?: number;
    reference?: string;
    cardLast4?: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        type: {
            type: String,
            enum: Object.values(NotificationType),
            required: true,
        },
        title: { type: String, required: true },
        message: { type: String, required: true },
        amount: { type: Number },
        reference: { type: String },
        cardLast4: { type: String },
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

NotificationSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<INotification>('Notification', NotificationSchema);
