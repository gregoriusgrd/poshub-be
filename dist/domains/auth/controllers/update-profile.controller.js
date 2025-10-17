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
exports.updateProfileController = void 0;
const update_profile_service_1 = require("../services/update-profile.service");
const auth_validations_1 = require("../validations/auth.validations");
const updateProfileController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId; // dari requireAuth middleware
        const { fullName } = auth_validations_1.updateProfileSchema.parse(req.body);
        // file dari multer
        const file = req.file;
        const updatedUser = yield (0, update_profile_service_1.updateProfileService)({
            userId,
            fullName,
            file,
        });
        return res.json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUser,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updateProfileController = updateProfileController;
