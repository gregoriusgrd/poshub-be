import { z } from "zod";

const toPositiveInt = z.preprocess((val) => {
  if (typeof val === "string") {
    const n = val.trim() === "" ? NaN : Number(val);
    return Number.isFinite(n) ? n : val;
  }
  return val;
}, z.number().int().positive());

const toPositiveNumber = z.preprocess((val) => {
  if (typeof val === "string") {
    const n = val.trim() === "" ? NaN : Number(val);
    return Number.isFinite(n) ? n : val;
  }
  return val;
}, z.number().positive());

export const transactionItemSchema = z.object({
  productId: toPositiveInt,
  quantity: z.number().int().positive(),
});

export const createTransactionSchema = z.object({
  shiftId: toPositiveInt,
  items: z.array(transactionItemSchema).nonempty("At least one item required"),
  paymentAmount: toPositiveNumber,
  paymentMethod: z.enum(["CASH", "DEBIT_CARD"]),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
