"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_middleware_1 = require("../../../core/middlewares/auth.middleware");
const role_middleware_1 = require("../../../core/middlewares/role.middleware");
const get_daily_sales_controller_1 = require("../daily-sales/controllers/get-daily-sales.controller");
const get_daily_sales_export_controller_1 = require("../daily-sales/controllers/get-daily-sales-export.controller");
const get_product_sales_controller_1 = require("../product-sales/controllers/get-product-sales.controller");
const get_product_sales_export_controller_1 = require("../product-sales/controllers/get-product-sales-export.controller");
const get_shift_sales_controller_1 = require("../shift-sales/controllers/get-shift-sales.controller");
const get_shift_sales_export_controller_1 = require("../shift-sales/controllers/get-shift-sales-export.controller");
const get_inconsistent_shifts_controller_1 = require("../inconsistencies/controllers/get-inconsistent-shifts.controller");
const get_inconsisten_shifts_export_controller_1 = require("../inconsistencies/controllers/get-inconsisten-shifts-export.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.requireAuth, (0, role_middleware_1.requireRole)([client_1.Role.ADMIN]));
// DAILY SALES REPORT
// GET /reports/daily
router.get("/daily", get_daily_sales_controller_1.getDailySalesController);
// GET /reports/daily/export
router.get("/daily/export", get_daily_sales_export_controller_1.getDailySalesExportController);
// PRODUCT SALES REPORT
// GET /reports/products
router.get("/products", get_product_sales_controller_1.getProductSalesController);
// GET /reports/products/export
router.get("/products/export", get_product_sales_export_controller_1.getProductSalesExportController);
// SHIFT SALES REPORT
// GET /reports/shifts
router.get("/shifts", get_shift_sales_controller_1.getShiftSalesController);
// GET /reports/shifts/export
router.get("/shifts/export", get_shift_sales_export_controller_1.getShiftSalesExportController);
// INCONSISTENT SHIFTS REPORT
// GET /reports/inconsistencies
router.get("/inconsistencies", get_inconsistent_shifts_controller_1.getInconsistentShiftsController);
// GET /reports/inconsistencies/export
router.get("/inconsistencies/export", get_inconsisten_shifts_export_controller_1.getInconsistentShiftsExportController);
exports.default = router;
