import { NextFunction, Request, Response } from "express";
import { getTransactionHistoryService } from "../services/get-transaction-history.service";
import { logger } from "../../../config/logger";

export const getTransactionHistoryController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info("Get transaction history controller called");
        const cashierId = req.user!.userId;
        const role = req.user!.role;

        const { page, limit, search } = req.query;

        const history = await getTransactionHistoryService({
            page: Number(page),
            limit: Number(limit),
            search: String(search || ""),
            cashierId,
            role,
        })
        logger.info(`Transaction history retrieved successfully: ${JSON.stringify(history)}`);

        return res.status(200).json({
            success: true,
            message: "Transaction history retrieved successfully",
            data: history,
        })
    } catch (err) {
        next(err);
    }
}