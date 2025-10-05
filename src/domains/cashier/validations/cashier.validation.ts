import { z } from 'zod';

// Reusable schemas

const fullNameSchema = z.string()
  .min(3, { message: "Full name must be at least 3 characters long" })
  .max(50, { message: "Full name must be at most 50 characters long" });

const emailSchema = z.string()
  .trim()
  .email({ message: "Invalid email address" })
  .transform((email) => email.toLowerCase());

const passwordSchema = z.string()
  .trim()
  .min(6, { message: "Password must be at least 6 characters long" })
  .max(50, { message: "Password must be at most 50 characters long" });

// CREATE Cashier

export const createCashierSchema = z.object({
    body: z.object({
        fullName: fullNameSchema,
        email: emailSchema,
        password: passwordSchema,
        profilePicture: z.string().url().optional(),
    })
})

// UPDATE Cashier

export const updateCashierSchema = z.object({
    body: z.object({
        fullName: fullNameSchema.optional(),
        email: emailSchema.optional(),
        password: passwordSchema.optional(),
        profilePicture: z.string().url().optional(),
    }),
    params: z.object({
        id: z.string().regex(/^\d+$/, "Id must be a number"),
    }),
});

// GET ONE Cashier (by id)

export const getOneCashierSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/, "Id must be a number"),
    }),
});

// DELETE Cashier (by id)

export const deleteCashierSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/, "Id must be a number"),
    })
})
