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
exports.updateProductService = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
const http_error_1 = require("../../../core/errors/http-error");
const error_codes_1 = require("../../../core/errors/error-codes");
const cloudinary_util_1 = require("../../../core/utils/cloudinary.util");
// UPDATE PRODUCT
const updateProductService = (id, data, file // hanya 1 file
) => __awaiter(void 0, void 0, void 0, function* () {
    // Cari product
    const product = yield prisma_1.default.product.findFirst({
        where: { id, isDeleted: false },
    });
    if (!product)
        throw (0, http_error_1.notFound)("Product not found", error_codes_1.EC.NOT_FOUND);
    let newImageUrl = null;
    // handle file upload
    if (file) {
        try {
            // Hapus gambar lama dari Cloudinary jika ada
            if (product.imageUrl) {
                yield (0, cloudinary_util_1.cloudinaryRemove)(product.imageUrl);
            }
            // Upload gambar baru
            const uploadResult = yield (0, cloudinary_util_1.cloudinaryUpload)(file, "products");
            newImageUrl = uploadResult.secure_url;
        }
        catch (error) {
            throw (0, http_error_1.internalError)("Failed to update product image", error_codes_1.EC.INTERNAL_SERVER_ERROR, error);
        }
    }
    const updatedProduct = yield prisma_1.default.product.update({
        where: { id },
        data: Object.assign(Object.assign({}, data), (newImageUrl && { imageUrl: newImageUrl })),
        include: { category: true },
    });
    return updatedProduct;
});
exports.updateProductService = updateProductService;
