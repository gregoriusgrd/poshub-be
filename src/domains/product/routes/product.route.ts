import { Router } from "express";
import { requireRole } from "../../../core/middlewares/role.middleware";
import { requireAuth } from "../../../core/middlewares/auth.middleware";
import { Role } from "@prisma/client";
import { uploaderRules } from "../../../core/utils/uploader.util";
import { getAllProductsController } from "../controllers/get-all-product.controller";
import { getProductByIdController } from "../controllers/get-id-product.controller";
import { createProductController } from "../controllers/create-product.controller";
import { updateProductController } from "../controllers/update-product.controller";
import { deleteProductController } from "../controllers/delete-product.controller";

const router = Router();

router.use(requireAuth);

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

router.use(requireRole([Role.ADMIN]));

router.post("/", uploaderRules.productImage.single("image"), createProductController);
router.put("/:id", uploaderRules.productImage.single("image"), updateProductController);
router.delete("/:id", deleteProductController);

export default router;