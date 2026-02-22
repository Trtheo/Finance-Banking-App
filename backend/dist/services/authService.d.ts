import { IUser } from '../models/User';
export declare const registerUser: (userData: any) => Promise<{
    _id: string;
    email: string;
    fullName: string;
    message: string;
}>;
export declare const loginUser: (loginData: any) => Promise<any>;
export declare const verifyLoginOtp: (userId: string, otp: string) => Promise<{
    _id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    token: string;
}>;
export declare const getUserProfile: (userId: string) => Promise<import("mongoose").Document<unknown, {}, IUser, {}, import("mongoose").DefaultSchemaOptions> & IUser & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare const updateUserProfile: (userId: string, updateData: any) => Promise<import("mongoose").Document<unknown, {}, IUser, {}, import("mongoose").DefaultSchemaOptions> & IUser & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare const requestPasswordReset: (email: string) => Promise<{
    userId: string;
    message: string;
}>;
export declare const verifyResetOtp: (userId: string, otp: string) => Promise<boolean>;
export declare const resetPassword: (userId: string, otp: string, newPassword: string) => Promise<void>;
//# sourceMappingURL=authService.d.ts.map