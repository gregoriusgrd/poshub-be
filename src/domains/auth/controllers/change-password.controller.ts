import { changePasswordService } from "../services/change-password.service";
import { Request, Response, NextFunction } from "express";

export const changePasswordController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId; // requireAuth middleware
        const { oldPassword, newPassword } = req.body;

        const updatedUser = await changePasswordService({ userId, oldPassword, newPassword });

        return res.json({
            success: true,
            message: "Password changed successfully",
            data: updatedUser
        })
    } catch (err) {
        next(err);
    }
}