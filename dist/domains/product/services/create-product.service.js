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
exports.createProductService = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
const http_error_1 = require("../../../core/errors/http-error");
const error_codes_1 = require("../../../core/errors/error-codes");
const cloudinary_util_1 = require("../../../core/utils/cloudinary.util");
// CREATE PRODUCT
const createProductService = (data, file // hanya 1 file
) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, price, stock, categoryId } = data;
    // validasi input
    if (!file) {
        throw (0, http_error_1.badRequest)("Product image is required", error_codes_1.EC.BAD_REQUEST);
    }
    // upload image ke Cloudinary
    let uploadedUrl = null;
    try {
        const uploadResult = yield (0, cloudinary_util_1.cloudinaryUpload)(file, "products");
        uploadedUrl = uploadResult.secure_url;
    }
    catch (error) {
        throw (0, http_error_1.internalError)("Failed to upload product image", error_codes_1.EC.INTERNAL_SERVER_ERROR, error);
    }
    const newProduct = yield prisma_1.default.product.create({
        data: {
            name,
            price,
            stock,
            categoryId,
            imageUrl: uploadedUrl,
        },
        include: { category: true }
    });
    return newProduct;
});
exports.createProductService = createProductService;
