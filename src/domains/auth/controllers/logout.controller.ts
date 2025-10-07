import { clearAuthCookie } from "../../../core/utils/cookie.util"
import { Request, Response } from "express";

export const logoutController = ( req: Request, res: Response ) => {
    clearAuthCookie(res);
    return res.json({
        success: true,
        message: "Logout successful",
    });
}