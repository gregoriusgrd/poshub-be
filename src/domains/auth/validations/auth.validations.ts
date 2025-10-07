import { z } from 'zod';
import { Role } from '@prisma/client';

// Reusable schemas

const usernameSchema = z.string()
  .trim()
  .min(2, { message: "Username must be at least 2 characters long" })
  .max(30, { message: "Username must be at most 30 characters long" })
  .transform((username) => username.toLowerCase());

const passwordSchema = z.string()
  .trim()
  .min(6, { message: "Password must be at least 6 characters long" })
  .max(50, { message: "Password must be at most 50 characters long" });

// Login schemas

export const loginSchema = z.object({
    username: usernameSchema,
    password: passwordSchema,
})
.strict();

export const changePasswordSchema = z.object({
    oldPassword: passwordSchema.optional(),
    newPassword: passwordSchema,
})
.strict();

export const updateProfileSchema = z.object({
    fullName: z.string().min(1).max(50).optional(),
    password: passwordSchema.optional(),
    profilePicture: z.string().url().optional(),
})
.strict();

// ini sementara saja, nanti dipindah

export interface TokenPayload {
  userId: number;
  role: Role;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: TokenPayload;
  }
}