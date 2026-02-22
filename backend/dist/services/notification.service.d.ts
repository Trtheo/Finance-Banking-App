export declare const sendLoginOtp: (email: string, name: string, otp: string) => Promise<void>;
export declare const sendWelcomeEmail: (email: string, name: string, accountNumber: string) => Promise<void>;
export declare const sendTransactionEmail: (email: string, name: string, amount: number, type: "DEPOSIT" | "WITHDRAW" | "TRANSFER", details?: {
    transactionId?: string;
    accountNumber?: string;
    recipient?: string;
}) => Promise<void>;
//# sourceMappingURL=notification.service.d.ts.map