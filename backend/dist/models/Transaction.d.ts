import mongoose, { Document } from 'mongoose';
export declare enum TransactionType {
    DEPOSIT = "DEPOSIT",
    WITHDRAW = "WITHDRAW",
    TRANSFER = "TRANSFER"
}
export declare enum TransactionStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
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
declare const _default: mongoose.Model<ITransaction, {}, {}, {}, mongoose.Document<unknown, {}, ITransaction, {}, mongoose.DefaultSchemaOptions> & ITransaction & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ITransaction>;
export default _default;
//# sourceMappingURL=Transaction.d.ts.map