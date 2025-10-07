import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  price: z.number().positive("Price must be positive").max(100_000_000),
  stock: z.number().int().nonnegative("Stock cannot be negative").max(10_000),
  categoryId: z.number().int(),
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
