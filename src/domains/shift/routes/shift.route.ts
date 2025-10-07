import { Router } from "express";
import { requireAuth } from "../../../core/middlewares/auth.middleware";
import { requireRole } from "../../../core/middlewares/role.middleware";
import { Role } from "@prisma/client";
import { startShiftController } from "../controllers/start-shift.controller";
import { endShiftController } from "../controllers/end-shift.controller";
import { getShiftSummaryController } from "../controllers/get-shift-summary.controller";

const router = Router();

router.use(requireAuth);

router.post("/start", requireRole([Role.CASHIER]), startShiftController);
router.post("/close", requireRole([Role.CASHIER]), endShiftController);
router.get("/:shiftId/summary", requireRole([Role.CASHIER, Role.ADMIN]), getShiftSummaryController);

export default router;