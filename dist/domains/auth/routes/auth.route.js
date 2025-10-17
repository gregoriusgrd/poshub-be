"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const login_controller_1 = require("../controllers/login.controller");
const auth_middleware_1 = require("../../../core/middlewares/auth.middleware");
const logout_controller_1 = require("../controllers/logout.controller");
const change_password_controller_1 = require("../controllers/change-password.controller");
const update_profile_controller_1 = require("../controllers/update-profile.controller");
const get_profile_controller_1 = require("../controllers/get-profile.controller");
const uploader_util_1 = require("../../../core/utils/uploader.util");
const router = (0, express_1.Router)();
// POST /api/auth/login
router.post("/login", login_controller_1.loginController);
router.use(auth_middleware_1.requireAuth);
// POST /api/auth/logout
router.post("/logout", logout_controller_1.logoutController);
/*
 * PATCH /api/auth/change-password
 * kasir bisa ganti sendiri, admin bisa ubah tanpa old password
 */
router.patch("/change-password", change_password_controller_1.changePasswordController);
// PATCH /api/auth/update-profile
router.patch("/update-profile", uploader_util_1.uploaderRules.profileImage.single("profilePicture"), update_profile_controller_1.updateProfileController);
router.get("/me", get_profile_controller_1.getProfileController);
exports.default = router;
