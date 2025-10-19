"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const get_daily_sales_controller_1 = require("../controllers/get-daily-sales.controller");
const get_daily_sales_export_controller_1 = require("../controllers/get-daily-sales-export.controller");
const router = (0, express_1.Router)();
router.get("/", get_daily_sales_controller_1.getDailySalesController);
router.get("/export", get_daily_sales_export_controller_1.getDailySalesExportController);
exports.default = router;
