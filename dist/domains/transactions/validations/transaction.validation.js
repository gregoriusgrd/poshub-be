"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransactionSchema = exports.transactionItemSchema = void 0;
const zod_1 = require("zod");
const toPositiveInt = zod_1.z.preprocess((val) => {
    if (typeof val === "string") {
        const n = val.trim() === "" ? NaN : Number(val);
        return Number.isFinite(n) ? n : val;
    }
    return val;
}, zod_1.z.number().int().positive());
const toPositiveNumber = zod_1.z.preprocess((val) => {
    if (typeof val === "string") {
        const n = val.trim() === "" ? NaN : Number(val);
        return Number.isFinite(n) ? n : val;
    }
    return val;
}, zod_1.z.number().positive());
exports.transactionItemSchema = zod_1.z.object({
    productId: toPositiveInt,
    quantity: zod_1.z.number().int().positive(),
});
exports.createTransactionSchema = zod_1.z.object({
    shiftId: toPositiveInt,
    items: zod_1.z.array(exports.transactionItemSchema).nonempty("At least one item required"),
    paymentAmount: toPositiveNumber,
    paymentMethod: zod_1.z.enum(["CASH", "DEBIT_CARD"]),
    cardNumber: zod_1.z.string().optional(),
    cardExpiry: zod_1.z.string().optional(),
    cardCvv: zod_1.z.string().optional(),
})
    .passthrough();
