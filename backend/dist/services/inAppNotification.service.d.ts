import { NotificationType } from '../models/Notification';
interface CreateInAppNotificationInput {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    amount?: number;
    reference?: string;
    cardLast4?: string;
}
export declare const createInAppNotification: (input: CreateInAppNotificationInput) => Promise<import("mongoose").Document<unknown, {}, import("../models/Notification").INotification, {}, import("mongoose").DefaultSchemaOptions> & import("../models/Notification").INotification & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare const getUserNotifications: (userId: string, limit?: number) => Promise<(import("mongoose").Document<unknown, {}, import("../models/Notification").INotification, {}, import("mongoose").DefaultSchemaOptions> & import("../models/Notification").INotification & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
})[]>;
export declare const getUnreadNotificationCount: (userId: string) => Promise<number>;
export declare const markNotificationAsRead: (userId: string, notificationId: string) => Promise<(import("mongoose").Document<unknown, {}, import("../models/Notification").INotification, {}, import("mongoose").DefaultSchemaOptions> & import("../models/Notification").INotification & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | null>;
export declare const markAllNotificationsAsRead: (userId: string) => Promise<{
    updatedCount: number;
}>;
export declare const deleteNotification: (userId: string, notificationId: string) => Promise<(import("mongoose").Document<unknown, {}, import("../models/Notification").INotification, {}, import("mongoose").DefaultSchemaOptions> & import("../models/Notification").INotification & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | null>;
export {};
//# sourceMappingURL=inAppNotification.service.d.ts.map