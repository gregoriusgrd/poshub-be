import { Router } from "express";
import { requireAuth } from "../../../core/middlewares/auth.middleware";
import { requireRole } from "../../../core/middlewares/role.middleware";
import { Role } from "@prisma/client";
import { getAllCategoriesController } from "../controllers/get-all-category.controller";
import { getCategoryByIdController } from "../controllers/get-id-category.controller";
import { createCategoryController } from "../controllers/create-category.controller";
import { updateCategoryController } from "../controllers/update-category.controller";
import { deleteCategoryController } from "../controllers/delete-category.controller";

const router = Router();

router.use(requireAuth);

/**
 * PUBLIC ROUTES
 * Bisa diakses kasir/admin untuk melihat kategori
 */
router.get("/", getAllCategoriesController);
router.get("/:id", getCategoryByIdController);

/**
 * ADMIN ROUTES
 * Hanya admin yang boleh manage kategori
 */
router.use(requireAuth, requireRole([Role.ADMIN]));

router.post("/", createCategoryController);
router.put("/:id", updateCategoryController);
router.delete("/:id", deleteCategoryController);

export default router;
