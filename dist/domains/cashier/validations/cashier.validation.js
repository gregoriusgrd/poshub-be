"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCashierSchema = exports.getCashierByIdSchema = exports.updateCashierSchema = exports.createCashierSchema = void 0;
const zod_1 = require("zod");
// Reusable schemas
const usernameSchema = zod_1.z.string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(30, { message: "Username must be at most 30 characters long" })
    .transform((username) => username.toLowerCase());
const fullNameSchema = zod_1.z.string()
    .trim()
    .min(3, { message: "Full name must be at least 3 characters long" })
    .max(50, { message: "Full name must be at most 50 characters long" });
const passwordSchema = zod_1.z.string()
    .trim();
// CREATE Cashier
exports.createCashierSchema = zod_1.z.object({
    username: usernameSchema,
    fullName: fullNameSchema,
    password: passwordSchema,
});
// UPDATE Cashier
exports.updateCashierSchema = zod_1.z.object({
    fullName: fullNameSchema.optional(),
    password: passwordSchema.optional(),
    profilePicture: zod_1.z.string().url().optional(),
});
// GET Cashier (by id)
exports.getCashierByIdSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^\d+$/, "Id must be a number"),
});
// DELETE Cashier (by id)
exports.deleteCashierSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^\d+$/, "Id must be a number"),
});
