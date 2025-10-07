import { z } from 'zod';

// Reusable schemas

const usernameSchema = z.string()
.trim()
.min(3, { message: "Username must be at least 3 characters long" })
.max(30, { message: "Username must be at most 30 characters long" })
.transform((username) => username.toLowerCase());

const fullNameSchema = z.string()
  .min(3, { message: "Full name must be at least 3 characters long" })
  .max(50, { message: "Full name must be at most 50 characters long" });

const passwordSchema = z.string()
  .trim()
  .min(6, { message: "Password must be at least 6 characters long" })
  .max(50, { message: "Password must be at most 50 characters long" });

// CREATE Cashier

export const createCashierSchema = z.object({
  username: usernameSchema,
  fullName: fullNameSchema,
  password: passwordSchema,
});

// UPDATE Cashier

export const updateCashierSchema = z.object({
  fullName: fullNameSchema.optional(),
  password: passwordSchema.optional(),
  profilePicture: z.string().url().optional(),
});

// GET Cashier (by id)

export const getCashierByIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "Id must be a number"),
});

// DELETE Cashier (by id)

export const deleteCashierSchema = z.object({
  id: z.string().regex(/^\d+$/, "Id must be a number"),
});
