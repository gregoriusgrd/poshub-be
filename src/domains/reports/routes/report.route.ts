import { Router } from "express";
import { Role } from "@prisma/client";
import { requireAuth } from "../../../core/middlewares/auth.middleware";
import { requireRole } from "../../../core/middlewares/role.middleware";

import { getDailySalesController } from "../daily-sales/controllers/get-daily-sales.controller";
import { getDailySalesExportController } from "../daily-sales/controllers/get-daily-sales-export.controller";

import { getProductSalesController } from "../product-sales/controllers/get-product-sales.controller";
import { getProductSalesExportController } from "../product-sales/controllers/get-product-sales-export.controller";

import { getShiftSalesController } from "../shift-sales/controllers/get-shift-sales.controller";
import { getShiftSalesExportController } from "../shift-sales/controllers/get-shift-sales-export.controller";

import { getInconsistentShiftsController } from "../inconsistencies/controllers/get-inconsistent-shifts.controller";
import { getInconsistentShiftsExportController } from "../inconsistencies/controllers/get-inconsisten-shifts-export.controller";

const router = Router();
router.use(requireAuth, requireRole([Role.ADMIN]));

// DAILY SALES REPORT

// GET /reports/daily
router.get("/daily", getDailySalesController);

// GET /reports/daily/export
router.get("/daily/export", getDailySalesExportController);

// PRODUCT SALES REPORT

// GET /reports/products
router.get("/products", getProductSalesController);

// GET /reports/products/export
router.get("/products/export", getProductSalesExportController);

// SHIFT SALES REPORT

// GET /reports/shifts
router.get("/shifts", getShiftSalesController);

// GET /reports/shifts/export
router.get("/shifts/export", getShiftSalesExportController);

// INCONSISTENT SHIFTS REPORT

// GET /reports/inconsistencies
router.get("/inconsistencies", getInconsistentShiftsController);

// GET /reports/inconsistencies/export
router.get("/inconsistencies/export", getInconsistentShiftsExportController);

export default router;
