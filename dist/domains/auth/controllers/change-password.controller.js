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
exports.changePasswordController = void 0;
const change_password_service_1 = require("../services/change-password.service");
const auth_validations_1 = require("../validations/auth.validations");
const changePasswordController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId; // requireAuth middleware
        const { oldPassword, newPassword } = auth_validations_1.changePasswordSchema.parse(req.body);
        const updatedUser = yield (0, change_password_service_1.changePasswordService)({ userId, oldPassword, newPassword });
        return res.json({
            success: true,
            message: "Password changed successfully",
            data: updatedUser
        });
    }
    catch (err) {
        next(err);
    }
});
exports.changePasswordController = changePasswordController;
