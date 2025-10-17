import { Request, Response, NextFunction } from "express";
import { getDailySalesService } from "../services/get-daily-sales.service";

export const getDailySalesController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await getDailySalesService(req.query);
        return res.status(200).json({
            success: true,
            message: "Daily sales report fetched successfully",
            ...result,
        });
    } catch (err) {
        next(err);
    }
}