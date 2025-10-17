"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_middleware_1 = require("../../../core/middlewares/auth.middleware");
const role_middleware_1 = require("../../../core/middlewares/role.middleware");
const get_daily_sales_controller_1 = require("../controllers/get-daily-sales.controller");
const get_product_sales_controller_1 = require("../controllers/get-product-sales.controller");
const get_shift_sales_controller_1 = require("../controllers/get-shift-sales.controller");
const get_inconsistent_shifts_controller_1 = require("../controllers/get-inconsistent-shifts.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.requireAuth, (0, role_middleware_1.requireRole)([client_1.Role.ADMIN]));
// GET /reports/daily
router.get("/daily", get_daily_sales_controller_1.getDailySalesController);
// GET /reports/product-sales
// GET http://localhost:4000/api/reports/products?start=2025-10-01&end=2025-10-16
router.get("/products", get_product_sales_controller_1.getProductSalesController);
// GET /reports/shifts
router.get("/shifts", get_shift_sales_controller_1.getShiftSalesController);
// GET /reports/inconsistencies
router.get("/inconsistencies", get_inconsistent_shifts_controller_1.getInconsistentShiftsController);
exports.default = router;
