"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productIdSchema = exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1, "Product name is required"),
    price: zod_1.z
        .union([zod_1.z.number(), zod_1.z.string()])
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val), "Price must be a valid number"),
    stock: zod_1.z
        .union([zod_1.z.number(), zod_1.z.string()])
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val), "Stock must be a valid number"),
    categoryId: zod_1.z
        .union([zod_1.z.number(), zod_1.z.string()])
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val), "Category ID must be a valid number"),
});
exports.updateProductSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1).max(100).optional(),
    price: zod_1.z
        .union([zod_1.z.number(), zod_1.z.string()])
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val), "Price must be a valid number")
        .optional(),
    stock: zod_1.z
        .union([zod_1.z.number(), zod_1.z.string()])
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val), "Stock must be a valid number")
        .optional(),
    categoryId: zod_1.z
        .union([zod_1.z.number(), zod_1.z.string()])
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val), "Category ID must be a valid number")
        .optional(),
    isDeleted: zod_1.z.boolean().optional(),
});
exports.productIdSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^\d+$/).transform(Number),
});
