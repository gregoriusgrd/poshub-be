import { z } from 'zod';

// Reusable schemas

const emailSchema = z.string()
  .trim()
  .email({ message: "Invalid email address" })
  .transform((email) => email.toLowerCase());

const passwordSchema = z.string()
  .trim()
  .min(6, { message: "Password must be at least 6 characters long" })
  .max(50, { message: "Password must be at most 50 characters long" });

// Login and Register schemas

export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
})
.strict();

export const registerSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    role: z.enum(["ADMIN", "CASHIER"]),
})
.strict();