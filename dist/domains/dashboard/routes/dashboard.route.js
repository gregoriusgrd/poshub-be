"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../../core/middlewares/auth.middleware");
const role_middleware_1 = require("../../../core/middlewares/role.middleware");
const client_1 = require("@prisma/client");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.requireAuth, (0, role_middleware_1.requireRole)([client_1.Role.ADMIN]));
// GET /api/dashboard/summary
router.get("/summary", dashboard_controller_1.getDashboardSummaryController);
exports.default = router;
