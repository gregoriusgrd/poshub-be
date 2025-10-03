import { Response } from "express";

const isProd = process.env.NODE_ENV === "production";

// Set cookie untuk auth token

export function setAuthCookie(res: Response, token: string) {
    res.cookie("auth_token", token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax", // prod: beda domain → "none"
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    })
}

// Hapus cookie auth token

export function clearAuthCookie(res: Response) {
    res.clearCookie("auth_token", {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
    });
}