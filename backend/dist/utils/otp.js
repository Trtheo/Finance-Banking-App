"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalOtp = void 0;
const generalOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generalOtp = generalOtp;
//# sourceMappingURL=otp.js.map