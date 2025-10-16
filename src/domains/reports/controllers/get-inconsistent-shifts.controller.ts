import { Request, Response, NextFunction } from "express";
import { getInconsistentShiftsService } from "../services/get-inconsistent-shifts.service";

export const getInconsistentShiftsController = async ( req: Request, res: Response, next: NextFunction ) => {
  try {
    const result = await getInconsistentShiftsService(req.query);
    return res.status(200).json({
      success: true,
      message: "Inconsistent shift report fetched successfully",
      ...result,
    });
  } catch (err) {
    next(err);
  }
};
