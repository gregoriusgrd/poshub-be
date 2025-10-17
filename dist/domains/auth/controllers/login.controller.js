"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = void 0;
const login_service_1 = require("../services/login.service");
const cookie_util_1 = require("../../../core/utils/cookie.util");
const auth_validations_1 = require("../validations/auth.validations");
const logger_1 = require("../../../config/logger");
const loginController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // validate request body
        const { username, password } = auth_validations_1.loginSchema.parse(req.body);
        logger_1.logger.info(`Attempting login for user: ${username}`);
        const { user, token } = yield (0, login_service_1.loginService)({ username, password });
        logger_1.logger.info(`User ${username} logged in successfully`);
        // Set token as httpOnly cookie
        (0, cookie_util_1.setAuthCookie)(res, token);
        logger_1.logger.info(`Auth cookie set for user: ${username}`);
        logger_1.logger.info(`Login successful for user: ${username}`);
        return res.json({
            success: true,
            message: "Login successful",
            data: { user, token },
        });
    }
    catch (err) {
        logger_1.logger.error(`Login failed: ${err.message}`);
        next(err);
    }
});
exports.loginController = loginController;
