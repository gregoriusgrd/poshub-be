import { NextFunction, Request, Response } from "express";
import { getTransactionHistoryService } from "../services/get-transaction-history.service";

export const getTransactionHistoryController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cashierId = req.user!.userId;
        const { page, limit, search } = req.query;

        const history = await getTransactionHistoryService({
            page: Number(page),
            limit: Number(limit),
            search: String(search || ""),
            cashierId,
        })

        return res.status(200).json({
            success: true,
            message: "Transaction history retrieved successfully",
            data: history,
        })
    } catch (err) {
        next(err);
    }
}