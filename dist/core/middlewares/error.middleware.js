"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFoundHandler = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const multer_1 = __importDefault(require("multer"));
const http_error_1 = require("../errors/http-error");
// Middleware untuk route yang tidak ditemukan
const notFoundHandler = (_req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        code: "ROUTE_NOT_FOUND",
    });
};
exports.notFoundHandler = notFoundHandler;
// Middleware utama error handler
const errorHandler = (err, req, res, _next) => {
    var _a, _b, _c;
    console.error(`[${req.method} ${req.url}]`, err);
    // Zod validation errors
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            success: false,
            message: "Invalid input",
            code: "VALIDATION_ERROR",
            errors: err.flatten(),
        });
    }
    // Prisma known errors
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            const target = Array.isArray((_a = err.meta) === null || _a === void 0 ? void 0 : _a.target)
                ? ((_b = err.meta) === null || _b === void 0 ? void 0 : _b.target).join(", ")
                : "field";
            const message = target === "username"
                ? "Username already exists."
                : `Duplicate value for ${target}.`;
            return res.status(409).json({
                success: false,
                message,
                code: "UNIQUE_CONSTRAINT",
            });
        }
        if (err.code === "P2025") {
            return res.status(404).json({
                success: false,
                message: "Record not found",
                code: "RECORD_NOT_FOUND",
            });
        }
        if (err.code === "P2003") {
            return res.status(400).json({
                success: false,
                message: "Cannot delete this record because it is still referenced by another resource.",
                code: "FOREIGN_KEY_CONSTRAINT",
                meta: err.meta,
            });
        }
    }
    // Multer error: File too large
    if (err instanceof multer_1.default.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                success: false,
                message: "File too large. Maximum allowed size is 1MB.",
                code: "LIMIT_FILE_SIZE",
            });
        }
        // other Multer errors (like fieldname mismatch)
        return res.status(400).json({
            success: false,
            message: `Upload error: ${err.message}`,
            code: "UPLOAD_ERROR",
        });
    }
    // Custom fileFilter error from uploader.util
    if ((_c = err.message) === null || _c === void 0 ? void 0 : _c.includes("Invalid file type")) {
        return res.status(400).json({
            success: false,
            message: "Invalid file type. Only images are allowed.",
            code: "INVALID_FILE_TYPE",
        });
    }
    // Custom HTTP error
    if ((0, http_error_1.isHttpError)(err)) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            code: err.code,
            errors: err.details,
        });
    }
    // Default (catch all)
    return res.status(500).json({
        success: false,
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
    });
};
exports.errorHandler = errorHandler;
