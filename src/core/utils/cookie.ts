import { Response } from "express";

export function setAuthCookie(res: Response, token: string) {
    res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    })
}

export function clearAuthCookie(res: Response) {
    res.clearCookie("auth_token");
}