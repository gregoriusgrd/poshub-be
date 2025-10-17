"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategoryService = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
const category_repository_1 = require("../repositories/category.repository");
const http_error_1 = require("../../../core/errors/http-error");
const deleteCategoryService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield (0, category_repository_1.getCategoryById)(id);
    if (!existing)
        throw (0, http_error_1.notFound)("Category not found");
    // Cek apakah masih ada produk aktif (belum soft-delete)
    const activeProducts = yield prisma_1.default.product.findMany({
        where: { categoryId: id, isDeleted: false },
        select: { id: true, name: true },
    });
    if (activeProducts.length > 0) {
        throw (0, http_error_1.badRequest)("Cannot delete this category because it still has active products.", "CATEGORY_HAS_ACTIVE_PRODUCTS");
    }
    // Cek apakah produk dalam kategori ini pernah punya transaksi historis
    const productsWithTransactions = yield prisma_1.default.product.findFirst({
        where: {
            categoryId: id,
            transactionItems: { some: {} },
        },
    });
    if (productsWithTransactions) {
        throw (0, http_error_1.badRequest)("Cannot delete this category because its products have transaction records.", "CATEGORY_HAS_TRANSACTIONS");
    }
    // Kalau aman, soft delete kategori
    yield prisma_1.default.category.update({
        where: { id },
        data: { isDeleted: true },
    });
    return { message: "Category deleted successfully" };
});
exports.deleteCategoryService = deleteCategoryService;
