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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginService = void 0;
const auth_errors_1 = require("../errors/auth.errors");
const user_repository_1 = require("../../user/repositories/user.repository");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_util_1 = require("../../../core/utils/jwt.util");
const loginService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ username, password }) {
    const user = yield (0, user_repository_1.findUserByUsername)(username);
    if (!user)
        throw (0, auth_errors_1.invalidCredentialsError)();
    const isMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!isMatch)
        throw (0, auth_errors_1.invalidCredentialsError)();
    const tokenPayload = { userId: user.id, role: user.role };
    const token = (0, jwt_util_1.signJwtToken)(tokenPayload);
    return {
        user: {
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            role: user.role,
            profilePicture: user.profilePicture,
        },
        token,
    };
});
exports.loginService = loginService;
