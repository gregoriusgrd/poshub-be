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
exports.updateUserProfile = exports.updateUserPassword = exports.findUserById = exports.findUserByUsername = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
// Function to find a user by username
const findUserByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.user.findUnique({
        where: { username },
    });
});
exports.findUserByUsername = findUserByUsername;
// Find user by ID (helper for services)
const findUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.user.findUnique({
        where: { id: userId },
    });
});
exports.findUserById = findUserById;
// Update user password
const updateUserPassword = (userId, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.user.update({
        where: { id: userId },
        data: { password: newPassword },
    });
});
exports.updateUserPassword = updateUserPassword;
// Update profile (fullName, profilePicture)
const updateUserProfile = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.user.update({
        where: { id: userId },
        data,
    });
});
exports.updateUserProfile = updateUserProfile;
