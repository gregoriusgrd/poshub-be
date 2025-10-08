import { Router } from "express";
import { requireAuth } from "../../../core/middlewares/auth.middleware";
import { requireRole } from "../../../core/middlewares/role.middleware";
import { Role } from "@prisma/client";
import { createTransactionController } from "../controller/create-transaction.controller";
import { getTransactionDetailController } from "../controller/get-transaction-detail.controller";
import { getTransactionHistoryController } from "../controller/get-transaction-history.controller";

const router = Router();

router.use(requireAuth)

// POST /transactions
router.post("/", requireRole([Role.CASHIER]), createTransactionController);

// GET /transactions/:transactionId
router.get("/:transactionId", requireRole([Role.CASHIER, Role.ADMIN]), getTransactionDetailController);

// GET /transactions
router.get("/", requireRole([Role.CASHIER, Role.ADMIN]), getTransactionHistoryController);

export default router;