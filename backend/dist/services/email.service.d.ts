export declare const sendEmail: (to: string, subject: string, html: string) => Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
export declare const testEmailConnection: (testEmail: string) => Promise<{
    success: boolean;
    messageId: string;
    error?: undefined;
} | {
    success: boolean;
    error: any;
    messageId?: undefined;
}>;
//# sourceMappingURL=email.service.d.ts.map