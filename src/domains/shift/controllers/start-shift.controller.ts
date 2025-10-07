import { NextFunction, Request, Response } from "express";
import { startShiftService } from "../services/start-shift.service";
import { StartShiftDTO } from "../dto/shift.dto";

export const startShiftController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cashierId = req.user!.userId!;
        const data: StartShiftDTO = req.body;

        const shift = await startShiftService(cashierId, data);

        return res.status(201).json({
            success: true,
            message: "Shift started successfully",
            data: shift,
        })
    } catch (err) {
        next(err);
    }
}