"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const http_error_1 = require("../errors/http-error");
// Middleware untuk membatasi akses berdasarkan role
const requireRole = (roles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return next((0, http_error_1.forbidden)("User not authenticated"));
        }
        if (!roles.includes(user.role)) {
            return next((0, http_error_1.forbidden)("User does not have permission"));
        }
        next();
    };
};
exports.requireRole = requireRole;
