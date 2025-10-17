"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../../core/middlewares/auth.middleware");
const role_middleware_1 = require("../../../core/middlewares/role.middleware");
const client_1 = require("@prisma/client");
const create_transaction_controller_1 = require("../controller/create-transaction.controller");
const get_transaction_detail_controller_1 = require("../controller/get-transaction-detail.controller");
const get_transaction_history_controller_1 = require("../controller/get-transaction-history.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.requireAuth);
// POST /transactions
router.post("/", (0, role_middleware_1.requireRole)([client_1.Role.CASHIER]), create_transaction_controller_1.createTransactionController);
// GET /transactions/:transactionId
router.get("/:transactionId", (0, role_middleware_1.requireRole)([client_1.Role.CASHIER, client_1.Role.ADMIN]), get_transaction_detail_controller_1.getTransactionDetailController);
// GET /transactions
router.get("/", (0, role_middleware_1.requireRole)([client_1.Role.CASHIER, client_1.Role.ADMIN]), get_transaction_history_controller_1.getTransactionHistoryController);
exports.default = router;
