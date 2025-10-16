import { Request, Response, NextFunction } from "express";
import { getProductSalesService } from "../services/get-product-sales.service";

export const getProductSalesController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await getProductSalesService(req.query);
        return res.status(200).json({
            success: true,
            message: "Product sales report fetched successfully",
            ...result,
        });
    } catch (err) {
        next(err);
    }
}