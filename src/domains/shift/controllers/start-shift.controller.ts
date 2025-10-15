import { NextFunction, Request, Response } from "express";
import { startShiftService } from "../services/start-shift.service";
import { StartShiftDTO } from "../dto/shift.dto";
import { logger } from "../../../config/logger";

export const startShiftController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info("Start shift controller called");
        const cashierId = req.user!.userId!;
        logger.info(`Cashier ID: ${cashierId}`);
        const data: StartShiftDTO = req.body;

        const shift = await startShiftService(cashierId, data);
        logger.info(`Shift started successfully: ${JSON.stringify(shift)}`);

        return res.status(201).json({
            success: true,
            message: "Shift started successfully",
            data: shift,
        })
    } catch (err) {
        next(err);
    }
}