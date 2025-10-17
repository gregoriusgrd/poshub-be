"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutController = void 0;
const cookie_util_1 = require("../../../core/utils/cookie.util");
const logoutController = (req, res) => {
    (0, cookie_util_1.clearAuthCookie)(res);
    return res.json({
        success: true,
        message: "Logout successful",
    });
};
exports.logoutController = logoutController;
