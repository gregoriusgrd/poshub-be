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
exports.changePasswordService = void 0;
const user_repository_1 = require("../../user/repositories/user.repository");
const auth_errors_1 = require("../errors/auth.errors");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_repository_2 = require("../../user/repositories/user.repository");
const changePasswordService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, oldPassword, newPassword }) {
    const user = yield (0, user_repository_1.findUserById)(userId);
    if (!user)
        throw (0, auth_errors_1.invalidCredentialsError)();
    // Jika oldPassword ada (beda untuk cashier), cek dulu
    if (oldPassword) {
        const isMatch = yield bcrypt_1.default.compare(oldPassword, user.password);
        if (!isMatch)
            throw (0, auth_errors_1.invalidCredentialsError)();
    }
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
    const updatedUser = yield (0, user_repository_2.updateUserPassword)(userId, hashedPassword);
    return {
        id: updatedUser.id,
        username: updatedUser.username,
        fullName: updatedUser.fullName,
        role: updatedUser.role,
    };
});
exports.changePasswordService = changePasswordService;
