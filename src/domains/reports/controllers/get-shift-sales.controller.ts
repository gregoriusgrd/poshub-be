import { Request, Response, NextFunction } from "express";
import { getShiftSalesService } from "../services/get-shift-sales.service";

export const getShiftSalesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getShiftSalesService(req.query);
    return res.status(200).json({
      success: true,
      message: "Shift sales report fetched successfully",
      ...result,
    });
  } catch (err) {
    next(err);
  }
};
