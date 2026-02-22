import { Request, Response } from 'express';
export declare const register: (req: Request, res: Response) => Promise<void>;
export declare const login: (req: Request, res: Response) => Promise<void>;
export declare const verifyLoginOtp: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getMe: (req: any, res: Response) => Promise<void>;
export declare const updateProfile: (req: any, res: Response) => Promise<void>;
export declare const forgotPassword: (req: Request, res: Response) => Promise<void>;
export declare const verifyResetOtp: (req: Request, res: Response) => Promise<void>;
export declare const resetPassword: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=authController.d.ts.map