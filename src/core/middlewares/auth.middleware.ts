import  { Request, Response, NextFunction } from "express";
import { verifyJwtToken } from "../utils/jwt.util";
import { unauthorized } from "../errors/http-error";

// Middleware untuk melindungi route yang membutuhkan autentikasi

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization ?? "";
    const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : undefined;
    const token = req.cookies?.token || bearerToken;

    if (!token) return next(unauthorized("Authentication token is missing"));

    try {
        const decoded = verifyJwtToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        next(unauthorized("Token is invalid or expired"));
    }
}