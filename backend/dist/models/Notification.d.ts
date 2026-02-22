import mongoose, { Document } from 'mongoose';
export declare enum NotificationType {
    DEPOSIT = "DEPOSIT",
    WITHDRAW = "WITHDRAW",
    TRANSFER_SENT = "TRANSFER_SENT",
    TRANSFER_RECEIVED = "TRANSFER_RECEIVED"
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
declare const _default: mongoose.Model<INotification, {}, {}, {}, mongoose.Document<unknown, {}, INotification, {}, mongoose.DefaultSchemaOptions> & INotification & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, INotification>;
export default _default;
//# sourceMappingURL=Notification.d.ts.map