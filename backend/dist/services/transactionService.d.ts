import mongoose from 'mongoose';
/**
 * Create a deposit transaction
 */
export declare const createDeposit: (userId: string, amount: number, description?: string, cardId?: string) => Promise<mongoose.Document<unknown, {}, import("../models/Transaction").ITransaction, {}, mongoose.DefaultSchemaOptions> & import("../models/Transaction").ITransaction & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
/**
 * Create a withdrawal transaction
 */
export declare const createWithdrawal: (userId: string, amount: number, description?: string, cardId?: string) => Promise<mongoose.Document<unknown, {}, import("../models/Transaction").ITransaction, {}, mongoose.DefaultSchemaOptions> & import("../models/Transaction").ITransaction & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
/**
 * Create a transfer transaction
 */
export declare const createTransfer: (senderId: string, receiverAccountNumber: string, amount: number, description?: string, cardId?: string) => Promise<mongoose.Document<unknown, {}, import("../models/Transaction").ITransaction, {}, mongoose.DefaultSchemaOptions> & import("../models/Transaction").ITransaction & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
/**
 * Get transaction history for a user
 */
export declare const getTransactionHistory: (userId: string) => Promise<(mongoose.Document<unknown, {}, import("../models/Transaction").ITransaction, {}, mongoose.DefaultSchemaOptions> & import("../models/Transaction").ITransaction & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
})[]>;
//# sourceMappingURL=transactionService.d.ts.map