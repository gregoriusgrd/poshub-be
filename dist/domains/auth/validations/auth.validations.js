"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = exports.changePasswordSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
// Reusable schemas
const usernameSchema = zod_1.z.string()
    .trim()
    .min(2, { message: "Username must be at least 2 characters long" })
    .max(30, { message: "Username must be at most 30 characters long" })
    .transform((username) => username.toLowerCase());
const passwordSchema = zod_1.z.string()
    .trim()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(50, { message: "Password must be at most 50 characters long" });
// Login schemas
exports.loginSchema = zod_1.z.object({
    username: usernameSchema,
    password: passwordSchema,
})
    .strict();
exports.changePasswordSchema = zod_1.z.object({
    oldPassword: passwordSchema.optional(),
    newPassword: passwordSchema,
})
    .strict();
exports.updateProfileSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(1).max(50).optional(),
});
