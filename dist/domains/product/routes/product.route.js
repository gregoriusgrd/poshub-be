"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const role_middleware_1 = require("../../../core/middlewares/role.middleware");
const auth_middleware_1 = require("../../../core/middlewares/auth.middleware");
const client_1 = require("@prisma/client");
const uploader_util_1 = require("../../../core/utils/uploader.util");
const get_all_product_controller_1 = require("../controllers/get-all-product.controller");
const get_id_product_controller_1 = require("../controllers/get-id-product.controller");
const create_product_controller_1 = require("../controllers/create-product.controller");
const update_product_controller_1 = require("../controllers/update-product.controller");
const delete_product_controller_1 = require("../controllers/delete-product.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.requireAuth);
/**
 * PUBLIC ROUTES
 * bisa diakses kasir untuk melihat produk
*/
router.get("/", get_all_product_controller_1.getAllProductsController);
router.get("/:id", get_id_product_controller_1.getProductByIdController);
/**
 * ADMIN ROUTES
 * hanya admin yg boleh manage produk
*/
router.use((0, role_middleware_1.requireRole)([client_1.Role.ADMIN]));
router.post("/", uploader_util_1.uploaderRules.productImage.single("image"), create_product_controller_1.createProductController);
router.put("/:id", uploader_util_1.uploaderRules.productImage.single("image"), update_product_controller_1.updateProductController);
router.delete("/:id", delete_product_controller_1.deleteProductController);
exports.default = router;
