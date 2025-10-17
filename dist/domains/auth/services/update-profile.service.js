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
exports.updateProfileService = void 0;
const user_repository_1 = require("../../user/repositories/user.repository");
const cloudinary_util_1 = require("../../../core/utils/cloudinary.util");
const http_error_1 = require("../../../core/errors/http-error");
const error_codes_1 = require("../../../core/errors/error-codes");
const prisma_1 = __importDefault(require("../../../config/prisma"));
const updateProfileService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, fullName, file }) {
    const user = yield prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!user)
        throw (0, http_error_1.notFound)(error_codes_1.EC.USER_NOT_FOUND);
    const data = {};
    if (fullName)
        data.fullName = fullName;
    // Upload image baru jika ada file
    if (file) {
        try {
            // hapus foto lama dari Cloudinary (kalau ada)
            if (user.profilePicture) {
                yield (0, cloudinary_util_1.cloudinaryRemove)(user.profilePicture);
            }
            const uploadResult = yield (0, cloudinary_util_1.cloudinaryUpload)(file, "users");
            data.profilePicture = uploadResult.secure_url;
        }
        catch (error) {
            throw (0, http_error_1.internalError)("Failed to upload profile image", error_codes_1.EC.INTERNAL_SERVER_ERROR, error);
        }
    }
    const updatedUser = yield (0, user_repository_1.updateUserProfile)(userId, data);
    return {
        id: updatedUser.id,
        username: updatedUser.username,
        fullName: updatedUser.fullName,
        role: updatedUser.role,
        profilePicture: updatedUser.profilePicture,
    };
});
exports.updateProfileService = updateProfileService;
