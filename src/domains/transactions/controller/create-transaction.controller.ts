import { Request, Response, NextFunction } from "express";
import { createTransactionService } from "../services/create-transaction.service";
import { createTransactionSchema } from "../validations/transaction.validation";
import { logger } from "../../../config/logger";


export const createTransactionController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // validasi body dengan zod schema
        logger.info("Create transaction controller called");
        const data = createTransactionSchema.parse(req.body);

        // ambil userId dari JWT payload
        const cashierId = req.user!.userId; // dari auth middleware
        logger.info(`Cashier ID: ${cashierId}, Data: ${JSON.stringify(data)}`);

        // panggil service untuk buat transaksi
        const transaction = await createTransactionService(cashierId, data)
        logger.info(`Transaction created successfully: ${JSON.stringify(transaction)}`);
        console.log("🔥 [DEBUG] req.body received:", req.body);

        return res.status(201).json({
            success: true,
            message: "Transaction created successfully",
            data: transaction,
        })
    } catch (err) {
        next(err);
    }
}