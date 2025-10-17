"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryIdSchema = exports.updateCategorySchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, "Category name must have at least 2 characters")
        .max(50, "Category name must not exceed 50 characters"),
});
exports.updateCategorySchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, "Category name must have at least 2 characters")
        .max(50, "Category name must not exceed 50 characters")
        .optional(),
});
exports.categoryIdSchema = zod_1.z.object({
    id: zod_1.z
        .string()
        .regex(/^\d+$/, "Category ID must be a valid number")
        .transform((val) => Number(val)),
});
