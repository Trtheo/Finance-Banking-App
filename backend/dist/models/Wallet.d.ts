import mongoose, { Document } from 'mongoose';
export interface IWallet extends Document {
    userId: mongoose.Types.ObjectId;
    accountNumber: string;
    balance: number;
    currency: string;
    status: 'active' | 'suspended';
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IWallet, {}, {}, {}, mongoose.Document<unknown, {}, IWallet, {}, mongoose.DefaultSchemaOptions> & IWallet & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IWallet>;
export default _default;
//# sourceMappingURL=Wallet.d.ts.map