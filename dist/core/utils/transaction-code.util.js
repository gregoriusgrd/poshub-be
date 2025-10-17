"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTransactionCode = generateTransactionCode;
const date_fns_1 = require("date-fns");
/**
 * Generate unique, readable transaction code.
 * Format: TRX-YYYYMMDD-RR
 * Example: TRX-20251014-AB
 */
function generateTransactionCode() {
    const datePart = (0, date_fns_1.format)(new Date(), "yyyyMMdd");
    const randomPart = Math.random().toString(36).substring(2, 4).toUpperCase();
    return `TRX-${datePart}-${randomPart}`;
}
