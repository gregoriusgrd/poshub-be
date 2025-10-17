"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.internalError = exports.conflict = exports.notFound = exports.forbidden = exports.unauthorized = exports.badRequest = void 0;
exports.isHttpError = isHttpError;
exports.HttpError = HttpError;
function isHttpError(err) {
    return (err === null || err === void 0 ? void 0 : err.name) === "HttpError" && typeof (err === null || err === void 0 ? void 0 : err.statusCode) === "number";
}
/**
 * Factory function untuk membuat HttpError object
 * untuk service controller dsb
 */
function HttpError(statusCode, message, code, details) {
    const err = new Error(message);
    err.name = "HttpError";
    err.statusCode = statusCode;
    err.code = code;
    err.details = details;
    return err;
}
// Helper shortcuts sesuai HTTP status umum
const badRequest = (message, code, details) => HttpError(400, message, code, details);
exports.badRequest = badRequest;
const unauthorized = (message, code, details) => HttpError(401, message, code, details);
exports.unauthorized = unauthorized;
const forbidden = (message, code, details) => HttpError(403, message, code, details);
exports.forbidden = forbidden;
const notFound = (message, code, details) => HttpError(404, message, code, details);
exports.notFound = notFound;
const conflict = (message, code, details) => HttpError(409, message, code, details);
exports.conflict = conflict;
const internalError = (message = "Internal server error", code, details) => HttpError(500, message, code, details);
exports.internalError = internalError;
