"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidCredentialsError = void 0;
const http_error_1 = require("../../../core/errors/http-error");
const error_codes_1 = require("../../../core/errors/error-codes");
// Error when user provides invalid username or password during login
const invalidCredentialsError = () => {
    (0, http_error_1.forbidden)("Invalid username or password", error_codes_1.EC.INVALID_CREDENTIALS);
};
exports.invalidCredentialsError = invalidCredentialsError;
