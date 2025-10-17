"use strict";
// Kumpulan error code untuk digunakan di seluruh aplikasi
Object.defineProperty(exports, "__esModule", { value: true });
exports.EC = void 0;
exports.EC = {
    // Auth Related
    INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
    UNAUTHORIZED: "UNAUTHORIZED",
    FORBIDDEN: "FORBIDDEN",
    // User Related
    USER_NOT_FOUND: "USER_NOT_FOUND",
    USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",
    // General
    BAD_REQUEST: "BAD_REQUEST",
    NOT_FOUND: "NOT_FOUND",
    CONFLICT: "CONFLICT",
    INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
    VALIDATION_ERROR: "VALIDATION_ERROR",
    // delete product related
    PRODUCT_HAS_TRANSACTIONS: "PRODUCT_HAS_TRANSACTIONS",
    CATEGORY_ALREADY_DELETED: "CATEGORY_ALREADY_DELETED",
    CASHIER_HAS_TRANSACTIONS: "CASHIER_HAS_TRANSACTIONS",
};
