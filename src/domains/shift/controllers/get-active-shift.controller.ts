import { Request, Response, NextFunction } from "express";
import { findActiveShiftByCashier } from "../repositories/shift.repository";
import { logger } from "../../../config/logger";

export const getActiveShiftController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info("Get active shift controller called");
    const cashierId = req.user!.userId;
    const shift = await findActiveShiftByCashier(cashierId);
    logger.info(`Active shift for cashier ID ${cashierId}: ${JSON.stringify(shift)}`);

    return res.status(200).json({
      success: true,
      message: shift ? "Active shift found" : "No active shift",
      data: shift,
    });
  } catch (err) {
    next(err);
  }
};
