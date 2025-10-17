"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../../core/middlewares/auth.middleware");
const role_middleware_1 = require("../../../core/middlewares/role.middleware");
const client_1 = require("@prisma/client");
const cashier_controller_1 = require("../controllers/cashier.controller");
const router = (0, express_1.Router)();
// Semua route hanya bisa diakses oleh ADMIN
router.use(auth_middleware_1.requireAuth, (0, role_middleware_1.requireRole)([client_1.Role.ADMIN]));
// CREATE cashier
router.post("/", cashier_controller_1.createCashierController);
// GET all cashier (pagination > /cashiers?page=2&limit=10)
router.get("/", cashier_controller_1.getAllCashiersController);
// GET one cashier by ID
router.get("/:id", cashier_controller_1.getCashierByIdController);
// UPDATE cashier by ID
router.put("/:id", cashier_controller_1.updateCashierController);
// DELETE cashier by ID (soft delete)
router.delete("/:id", cashier_controller_1.deleteCashierController);
exports.default = router;
