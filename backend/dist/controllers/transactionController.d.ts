import { Response } from 'express';
/**
 * Handle direct deposit
 */
export declare const deposit: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Handle withdrawal
 */
export declare const withdraw: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Handle fund transfer
 */
export declare const transfer: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get current user's transactions
 */
export declare const getMyTransactions: (req: any, res: Response) => Promise<void>;
//# sourceMappingURL=transactionController.d.ts.map