import { Request, Response } from 'express';
export declare const deposit: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const withdraw: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getWallet: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=walletController.d.ts.map