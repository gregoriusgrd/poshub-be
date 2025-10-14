import { Request, Response, NextFunction } from "express";
import { findActiveShiftByCashier } from "../repositories/shift.repository";

export const getActiveShiftController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cashierId = req.user!.userId;
    const shift = await findActiveShiftByCashier(cashierId);

    return res.status(200).json({
      success: true,
      message: shift ? "Active shift found" : "No active shift",
      data: shift,
    });
  } catch (err) {
    next(err);
  }
};
