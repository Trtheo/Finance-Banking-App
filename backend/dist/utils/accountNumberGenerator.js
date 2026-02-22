"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccountNumber = generateAccountNumber;
function generateAccountNumber() {
    // Generate a random 10-digit number. ensure it starts with non-zero to avoid parse confusion if treated as number
    // Bank of Kigali starts generally with 40 or 04, lets use random 10 digits
    // Or stick to 10 digits random
    const min = 1000000000;
    const max = 9999999999;
    return Math.floor(Math.random() * (max - min + 1) + min).toString();
}
//# sourceMappingURL=accountNumberGenerator.js.map