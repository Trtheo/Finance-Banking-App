import { Response } from 'express';
export declare const createCard: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getCardsByAccount: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const freezeCard: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const unfreezeCard: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteCard: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=cardController.d.ts.map