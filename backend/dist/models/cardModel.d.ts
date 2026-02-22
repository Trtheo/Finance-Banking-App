import mongoose from 'mongoose';
declare const _default: mongoose.Model<{
    createdAt: NativeDate;
    balance: number;
    status: "active" | "blocked";
    cardNumber: string;
    cardHolderName: string;
    cvv: string;
    expiryDate: NativeDate;
    walletId: mongoose.Types.ObjectId;
    cardType: "debit" | "credit" | "prepaid";
    cardTier: "PLATINUM" | "GOLD";
    network: "Visa" | "Mastercard";
    isDefault: boolean;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    balance: number;
    status: "active" | "blocked";
    cardNumber: string;
    cardHolderName: string;
    cvv: string;
    expiryDate: NativeDate;
    walletId: mongoose.Types.ObjectId;
    cardType: "debit" | "credit" | "prepaid";
    cardTier: "PLATINUM" | "GOLD";
    network: "Visa" | "Mastercard";
    isDefault: boolean;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    createdAt: NativeDate;
    balance: number;
    status: "active" | "blocked";
    cardNumber: string;
    cardHolderName: string;
    cvv: string;
    expiryDate: NativeDate;
    walletId: mongoose.Types.ObjectId;
    cardType: "debit" | "credit" | "prepaid";
    cardTier: "PLATINUM" | "GOLD";
    network: "Visa" | "Mastercard";
    isDefault: boolean;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    createdAt: NativeDate;
    balance: number;
    status: "active" | "blocked";
    cardNumber: string;
    cardHolderName: string;
    cvv: string;
    expiryDate: NativeDate;
    walletId: mongoose.Types.ObjectId;
    cardType: "debit" | "credit" | "prepaid";
    cardTier: "PLATINUM" | "GOLD";
    network: "Visa" | "Mastercard";
    isDefault: boolean;
}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    balance: number;
    status: "active" | "blocked";
    cardNumber: string;
    cardHolderName: string;
    cvv: string;
    expiryDate: NativeDate;
    walletId: mongoose.Types.ObjectId;
    cardType: "debit" | "credit" | "prepaid";
    cardTier: "PLATINUM" | "GOLD";
    network: "Visa" | "Mastercard";
    isDefault: boolean;
}, {
    id: string;
}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
    createdAt: NativeDate;
    balance: number;
    status: "active" | "blocked";
    cardNumber: string;
    cardHolderName: string;
    cvv: string;
    expiryDate: NativeDate;
    walletId: mongoose.Types.ObjectId;
    cardType: "debit" | "credit" | "prepaid";
    cardTier: "PLATINUM" | "GOLD";
    network: "Visa" | "Mastercard";
    isDefault: boolean;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: mongoose.SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: mongoose.SchemaDefinitionProperty<any, any, mongoose.Document<unknown, {}, {
        createdAt: NativeDate;
        balance: number;
        status: "active" | "blocked";
        cardNumber: string;
        cardHolderName: string;
        cvv: string;
        expiryDate: NativeDate;
        walletId: mongoose.Types.ObjectId;
        cardType: "debit" | "credit" | "prepaid";
        cardTier: "PLATINUM" | "GOLD";
        network: "Visa" | "Mastercard";
        isDefault: boolean;
    }, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
        createdAt: NativeDate;
        balance: number;
        status: "active" | "blocked";
        cardNumber: string;
        cardHolderName: string;
        cvv: string;
        expiryDate: NativeDate;
        walletId: mongoose.Types.ObjectId;
        cardType: "debit" | "credit" | "prepaid";
        cardTier: "PLATINUM" | "GOLD";
        network: "Visa" | "Mastercard";
        isDefault: boolean;
    } & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    createdAt: NativeDate;
    balance: number;
    status: "active" | "blocked";
    cardNumber: string;
    cardHolderName: string;
    cvv: string;
    expiryDate: NativeDate;
    walletId: mongoose.Types.ObjectId;
    cardType: "debit" | "credit" | "prepaid";
    cardTier: "PLATINUM" | "GOLD";
    network: "Visa" | "Mastercard";
    isDefault: boolean;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    createdAt: NativeDate;
    balance: number;
    status: "active" | "blocked";
    cardNumber: string;
    cardHolderName: string;
    cvv: string;
    expiryDate: NativeDate;
    walletId: mongoose.Types.ObjectId;
    cardType: "debit" | "credit" | "prepaid";
    cardTier: "PLATINUM" | "GOLD";
    network: "Visa" | "Mastercard";
    isDefault: boolean;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default _default;
//# sourceMappingURL=cardModel.d.ts.map