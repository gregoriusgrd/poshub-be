import { Router } from "express";
import { requireAuth } from "../../../core/middlewares/auth.middleware";
import { requireRole } from "../../../core/middlewares/role.middleware";
import { Role } from "@prisma/client";
import { validateRequest } from "../../../core/middlewares/validate.middleware";
import { createCashierSchema, deleteCashierSchema, getCashierByIdSchema, updateCashierSchema } from "../validations/cashier.validation";
import { createCashierController, deleteCashierController, getAllCashiersController, getCashierByIdController, updateCashierController } from "../controllers/cashier.controller";

const router = Router();

// Semua route hanya bisa diakses oleh ADMIN
router.use(requireAuth, requireRole([Role.ADMIN]))

// CREATE cashier
router.post("/", validateRequest(createCashierSchema), createCashierController);

// GET all cashier (pagination > /cashiers?page=2&limit=10)
router.get("/", getAllCashiersController);

// GET one cashier by ID
router.get("/:id", validateRequest(getCashierByIdSchema), getCashierByIdController);

// UPDATE cashier by ID
router.put("/:id", validateRequest(updateCashierSchema), updateCashierController);

// DELETE cashier by ID (soft delete)
router.delete("/:id", validateRequest(deleteCashierSchema), deleteCashierController);

export default router;