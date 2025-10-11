import { Router } from "express";
import { loginController } from "../controllers/login.controller";
import { requireAuth } from "../../../core/middlewares/auth.middleware";
import { logoutController } from "../controllers/logout.controller";
import { changePasswordController } from "../controllers/change-password.controller";
import { updateProfileController } from "../controllers/update-profile.controller";
import { getProfileController } from "../controllers/get-profile.controller";

const router = Router();

// POST /api/auth/login
router.post("/login", loginController);

router.use(requireAuth);

// POST /api/auth/logout
router.post("/logout", logoutController);

/*
 * PATCH /api/auth/change-password
 * kasir bisa ganti sendiri, admin bisa ubah tanpa old password
 */
router.patch("/change-password", changePasswordController);

// PATCH /api/auth/update-profile
router.patch("/update-profile", updateProfileController);

router.get("/me", getProfileController);


export default router;