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
exports.getProfileController = void 0;
const get_profile_service_1 = require("../services/get-profile.service");
const getProfileController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId; // requireAuth middleware
        const user = yield (0, get_profile_service_1.getProfileService)(userId);
        return res.json({
            success: true,
            message: "Profile retrieved successfully",
            data: user,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getProfileController = getProfileController;
