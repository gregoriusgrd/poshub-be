import { z } from 'zod';
import { Role } from '@prisma/client';

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
    fullName: z.string().min(1).max(100)
})
.strict();

// ini sementara saja, nanti dihapus

export interface TokenPayload {
  userId: number;
  role: Role;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: TokenPayload;
  }
}