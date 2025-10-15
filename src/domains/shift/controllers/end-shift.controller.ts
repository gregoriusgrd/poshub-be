import { NextFunction, Request, Response } from "express";
import { EndShiftDTO } from "../dto/shift.dto";
import { endShiftService } from "../services/end-shift.service";
import { logger } from "../../../config/logger";

export const endShiftController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info("End shift controller called");
        const cashierId = req.user!.userId!;
        const data: EndShiftDTO = req.body;
        logger.info(`Cashier ID: ${cashierId}, Data: ${JSON.stringify(data)}`);

        const result = await endShiftService(cashierId, data);
        logger.info(`Shift ended successfully: ${JSON.stringify(result)}`);

        return res.status(201).json({
            success: true,
            message: "Shift ended successfully",
            data: result,
        })
    } catch (err) {
        next(err);
    }
}