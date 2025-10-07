import { NextFunction, Request, Response } from "express";
import { getShiftSummary } from "../repositories/shift.repository";

export const getShiftSummaryController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const shiftId = Number(req.params.id);
        const shift = await getShiftSummary(shiftId);

        if (!shift) {
            return res.status(404).json({
                success: false,
                message: "Shift not found",
            });
        };

        return res.status(200).json({
            success: true,
            message: "Shift summary retrieved successfully",
            data: shift,
        })
    } catch (err) {
        next(err);
    }
}