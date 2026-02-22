import { Response } from 'express';
export declare const getMyNotifications: (req: any, res: Response) => Promise<void>;
export declare const markOneAsRead: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const markAllAsRead: (req: any, res: Response) => Promise<void>;
export declare const deleteNotification: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUnreadCount: (req: any, res: Response) => Promise<void>;
//# sourceMappingURL=inAppNotificationController.d.ts.map