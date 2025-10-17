"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFoundHandler = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
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
    console.error(`[${req.method} ${req.url}]`, err);
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            success: false,
            message: "Invalid input",
            code: "VALIDATION_ERROR",
            errors: err.flatten(),
        });
    }
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            return res.status(409).json({
                success: false,
                message: "Unique constraint violation",
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
            // Foreign key constraint violated
            return res.status(400).json({
                success: false,
                message: "Cannot delete this record because it is still referenced by another resource",
                code: "FOREIGN_KEY_CONSTRAINT",
                meta: err.meta, // optional, for debugging
            });
        }
    }
    if ((0, http_error_1.isHttpError)(err)) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            code: err.code,
            errors: err.details,
        });
    }
    return res.status(500).json({
        success: false,
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
    });
};
exports.errorHandler = errorHandler;
