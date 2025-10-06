import { Router } from "express";
import { createProductController, deleteProductController, getAllProductsController, getProductByIdController, updateProductController } from "../controllers/product.controller";
import { requireRole } from "../../../core/middlewares/role.middleware";
import { requireAuth } from "../../../core/middlewares/auth.middleware";
import { Role } from "@prisma/client";

const router = Router();

/**
 * PUBLIC ROUTES
 * bisa diakses kasir untuk melihat produk
*/

router.get("/", getAllProductsController);
router.get("/:id", getProductByIdController);

/**
 * ADMIN ROUTES
 * hanya admin yg boleh manage produk
*/

router.use(requireAuth, requireRole([Role.ADMIN]));

router.post("/", createProductController);
router.put("/:id", updateProductController);
router.delete("/:id", deleteProductController);

export default router;