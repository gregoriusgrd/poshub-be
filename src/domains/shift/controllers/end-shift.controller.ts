import { NextFunction, Request, Response } from "express";
import { EndShiftDTO } from "../dto/shift.dto";
import { endShiftService } from "../services/end-shift.service";

export const endShiftController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cashierId = req.user!.userId!;
        const data: EndShiftDTO = req.body;

        const result = await endShiftService(cashierId, data);

        return res.status(201).json({
            success: true,
            message: "Shift ended successfully",
            data: result,
        })
    } catch (err) {
        next(err);
    }
}