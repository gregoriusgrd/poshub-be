"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const jwt_util_1 = require("../utils/jwt.util");
const http_error_1 = require("../errors/http-error");
const logger_1 = require("../../config/logger");
// Middleware untuk melindungi route yang membutuhkan autentikasi
const requireAuth = (req, res, next) => {
    var _a, _b;
    const authHeader = (_a = req.headers.authorization) !== null && _a !== void 0 ? _a : "";
    const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : undefined;
    const token = ((_b = req.cookies) === null || _b === void 0 ? void 0 : _b.auth_token) || bearerToken;
    if (!token)
        return next((0, http_error_1.unauthorized)("Authentication token is missing"));
    try {
        const decoded = (0, jwt_util_1.verifyJwtToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        logger_1.logger.warn(`Invalid token: ${error.message}`);
        next((0, http_error_1.unauthorized)("Token is invalid or expired"));
    }
};
exports.requireAuth = requireAuth;
