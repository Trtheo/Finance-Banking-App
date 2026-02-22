import { Response } from 'express';
/**
 * Register or update push notification token
 */
export declare const registerPushToken: (req: any, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Remove push notification token (e.g., on logout)
 */
export declare const removePushToken: (req: any, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=pushNotificationController.d.ts.map