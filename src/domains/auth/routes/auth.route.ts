import { Router } from "express";
import { validateRequest } from "../../../core/middlewares/validate.middleware";
import { loginSchema, registerSchema } from "../validations/auth.validations";
import { loginController } from "../controllers/login.controller";
import { registerController } from "../controllers/register.controller";

const router = Router();

router.post("/login", validateRequest(loginSchema), loginController);

router.post("/register", validateRequest(registerSchema), registerController);

export default router;