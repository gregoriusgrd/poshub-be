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
exports.deleteProductService = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
const http_error_1 = require("../../../core/errors/http-error");
const error_codes_1 = require("../../../core/errors/error-codes");
const cloudinary_util_1 = require("../../../core/utils/cloudinary.util");
/**
 * Soft delete product
 * - Tidak boleh dihapus jika masih memiliki transaksi
 * - Menghapus gambar Cloudinary jika ada
 */
const deleteProductService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Cari produk
    const product = yield prisma_1.default.product.findFirst({
        where: { id, isDeleted: false },
        include: { category: true },
    });
    if (!product)
        throw (0, http_error_1.notFound)("Product not found", error_codes_1.EC.NOT_FOUND);
    // Cek apakah produk punya transaksi
    const hasTransactions = yield prisma_1.default.transactionItem.findFirst({
        where: { productId: id },
    });
    if (hasTransactions) {
        throw (0, http_error_1.badRequest)("Cannot delete this product because it has transaction records.", error_codes_1.EC.PRODUCT_HAS_TRANSACTIONS);
    }
    // Cek apakah kategori produk sudah dihapus (optional tapi bagus)
    if (product.category && product.category.isDeleted) {
        throw (0, http_error_1.badRequest)("Cannot delete this product because its category is already deleted.", error_codes_1.EC.CATEGORY_ALREADY_DELETED);
    }
    // Hapus gambar di Cloudinary (jika ada)
    try {
        if (product.imageUrl) {
            yield (0, cloudinary_util_1.cloudinaryRemove)(product.imageUrl);
        }
    }
    catch (err) {
        throw (0, http_error_1.internalError)("Failed to remove product image from Cloudinary", error_codes_1.EC.INTERNAL_SERVER_ERROR, err);
    }
    // Soft delete produk
    yield prisma_1.default.product.update({
        where: { id },
        data: { isDeleted: true },
    });
    return { message: "Product soft deleted successfully" };
});
exports.deleteProductService = deleteProductService;
