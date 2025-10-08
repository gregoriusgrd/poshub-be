import { Request, Response, NextFunction } from "express";
import { createTransactionService } from "../services/create-transaction.service";
import { createTransactionSchema } from "../validations/transaction.validation";


export const createTransactionController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // validasi body dengan zod schema
        const data = createTransactionSchema.parse(req.body);

        // ambil userId dari JWT payload
        const cashierId = req.user!.userId; // dari auth middleware

        // panggil service untuk buat transaksi
        const transaction = await createTransactionService(cashierId, data)

        return res.status(201).json({
            success: true,
            message: "Transaction created successfully",
            data: transaction,
        })
    } catch (err) {
        next(err);
    }
}