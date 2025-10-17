"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../../core/middlewares/auth.middleware");
const role_middleware_1 = require("../../../core/middlewares/role.middleware");
const client_1 = require("@prisma/client");
const get_all_category_controller_1 = require("../controllers/get-all-category.controller");
const get_id_category_controller_1 = require("../controllers/get-id-category.controller");
const create_category_controller_1 = require("../controllers/create-category.controller");
const update_category_controller_1 = require("../controllers/update-category.controller");
const delete_category_controller_1 = require("../controllers/delete-category.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.requireAuth);
/**
 * PUBLIC ROUTES
 * Bisa diakses kasir/admin untuk melihat kategori
 */
router.get("/", get_all_category_controller_1.getAllCategoriesController);
router.get("/:id", get_id_category_controller_1.getCategoryByIdController);
/**
 * ADMIN ROUTES
 * Hanya admin yang boleh manage kategori
 */
router.use(auth_middleware_1.requireAuth, (0, role_middleware_1.requireRole)([client_1.Role.ADMIN]));
router.post("/", create_category_controller_1.createCategoryController);
router.put("/:id", update_category_controller_1.updateCategoryController);
router.delete("/:id", delete_category_controller_1.deleteCategoryController);
exports.default = router;
