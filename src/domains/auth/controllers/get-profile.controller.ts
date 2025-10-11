import { NextFunction, Request, Response } from "express";
import { getProfileService } from "../services/get-profile.service";

export const getProfileController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId; // requireAuth middleware
        const user = await getProfileService(userId);

        return res.json({
            success: true,
            message: "Profile retrieved successfully",
            data: user,
        })
    } catch (err) {
        next(err);
    }
}