import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().trim().min(1, "Product name is required"),
  price: z
    .union([z.number(), z.string()])
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), "Price must be a valid number"),
  stock: z
    .union([z.number(), z.string()])
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), "Stock must be a valid number"),
  categoryId: z
    .union([z.number(), z.string()])
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), "Category ID must be a valid number"),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  price: z.number().positive().max(100_000_000).optional(),
  stock: z.number().int().nonnegative().max(10_000).optional(),
  categoryId: z.number().int().optional(),
  isDeleted: z.boolean().optional(),
});

export const productIdSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
});
