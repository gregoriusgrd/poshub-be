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
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getAllProducts = exports.createProduct = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
const createProduct = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.product.create({
        data: {
            name: data.name,
            price: data.price,
            stock: data.stock,
            categoryId: data.categoryId,
            imageUrl: data.imageUrl,
        },
        include: { category: true }
    });
});
exports.createProduct = createProduct;
const getAllProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.product.findMany({
        where: { isDeleted: false },
        include: { category: true },
        orderBy: { createdAt: 'desc' },
    });
});
exports.getAllProducts = getAllProducts;
const getProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.product.findUnique({
        where: { id },
        include: { category: true },
    });
});
exports.getProductById = getProductById;
const updateProduct = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.product.update({
        where: { id },
        data,
        include: { category: true },
    });
});
exports.updateProduct = updateProduct;
const deleteProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.product.update({
        where: { id },
        data: { isDeleted: true },
    });
});
exports.deleteProduct = deleteProduct;
