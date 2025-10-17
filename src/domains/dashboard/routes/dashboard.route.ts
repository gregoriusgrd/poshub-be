import { Router } from "express";
import { requireAuth } from "../../../core/middlewares/auth.middleware";
import { requireRole } from "../../../core/middlewares/role.middleware";
import { Role } from "@prisma/client";
import { getDashboardSummaryController } from "../controllers/dashboard.controller";

const router = Router();

router.use(requireAuth, requireRole([Role.ADMIN]));

// GET /api/dashboard/summary
router.get("/summary", getDashboardSummaryController);

export default router;
