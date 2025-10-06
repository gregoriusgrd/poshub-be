import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must have at least 2 characters")
    .max(50, "Category name must not exceed 50 characters"),
});

export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must have at least 2 characters")
    .max(50, "Category name must not exceed 50 characters")
    .optional(),
});

export const categoryIdSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "Category ID must be a valid number")
    .transform((val) => Number(val)),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CategoryIdInput = z.infer<typeof categoryIdSchema>;
