// Kumpulan error code untuk digunakan di seluruh aplikasi

export const EC = {

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
} as const;

export type ErrorCode = typeof EC[keyof typeof EC];