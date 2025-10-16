import { Router } from "express";
import { Role } from "@prisma/client";
import { requireAuth } from "../../../core/middlewares/auth.middleware";
import { requireRole } from "../../../core/middlewares/role.middleware";
import { getDailySalesController } from "../controllers/get-daily-sales.controller";
import { getProductSalesController } from "../controllers/get-product-sales.controller";
import { getShiftSalesController } from "../controllers/get-shift-sales.controller";
import { getInconsistentShiftsController } from "../controllers/get-inconsistent-shifts.controller";

const router = Router();

router.use(requireAuth, requireRole([Role.ADMIN]));

// GET /reports/daily
router.get("/daily", getDailySalesController);

// GET /reports/product-sales
// GET http://localhost:4000/api/reports/products?start=2025-10-01&end=2025-10-16
router.get("/products", getProductSalesController);

// GET /reports/shifts
router.get("/shifts", getShiftSalesController);

// GET /reports/inconsistencies
router.get("/inconsistencies", getInconsistentShiftsController);

export default router;