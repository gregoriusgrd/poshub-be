import { Router } from "express";
import { loginController } from "../controllers/login.controller";
import { validateRequest } from "../../../core/middlewares/validate.middleware";
import { loginSchema } from "../validations/auth.validations";

const router = Router();

router.post("/login", validateRequest(loginSchema), loginController);

export default router;