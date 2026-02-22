import mongoose, { Document } from 'mongoose';
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
    resetPasswordOtp?: string;
    resetPasswordOtpExpires?: Date;
    pushToken?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUser>;
export default _default;
//# sourceMappingURL=User.d.ts.map