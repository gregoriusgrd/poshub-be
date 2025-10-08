import { NextFunction, Request, Response } from "express";
import { badRequest } from "../../../core/errors/http-error";
import { getTransactionDetailService } from "../services/get-transaction-detail.service";

export const getTransactionDetailController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { transactionId } = req.params;
        if (!transactionId) throw badRequest("Transaction ID is required");

        const detail = await getTransactionDetailService(Number(transactionId));

        return res.status(200).json({
            success: true,
            message: "Transaction detail retrieved successfully",
            data: detail,
        })
    } catch (err) {
        next(err);
    }
}