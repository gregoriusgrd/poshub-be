import { Request, Response, NextFunction } from "express";
import { getDashboardSummaryService } from "../services/dashboard.service";

export const getDashboardSummaryController = async ( req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getDashboardSummaryService();
    return res.status(200).json({
      success: true,
      message: "Dashboard summary fetched successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
};
