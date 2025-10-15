import { NextFunction, Request, Response } from "express";
import { badRequest } from "../../../core/errors/http-error";
import { getTransactionDetailService } from "../services/get-transaction-detail.service";
import { logger } from "../../../config/logger";

export const getTransactionDetailController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { transactionId } = req.params;
        logger  .info("Get transaction detail controller called");
        if (!transactionId) throw badRequest("Transaction ID is required");

        const user = {
            id: req.user!.userId,
            role: req.user!.role,
        }

        const detail = await getTransactionDetailService(Number(transactionId), user);
        logger.info(`Transaction detail retrieved successfully: ${JSON.stringify(detail)}`);

        return res.status(200).json({
            success: true,
            message: "Transaction detail retrieved successfully",
            data: detail,
        })
    } catch (err) {
        next(err);
    }
}