import  { Request, Response, NextFunction } from "express";
import { verifyJwtToken } from "../utils/jwt.util";
import { unauthorized } from "../errors/http-error";
import { TokenPayload } from "../types/jwt.types";
import { logger } from "../../config/logger";

// Middleware untuk melindungi route yang membutuhkan autentikasi

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization ?? "";
    const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : undefined;
    const token = req.cookies?.token || bearerToken;

    if (!token) return next(unauthorized("Authentication token is missing"));

    try {
        const decoded = verifyJwtToken(token) as TokenPayload;
        req.user = decoded;
        next();
    } catch (error) {
        logger.warn(`Invalid token: ${(error as Error).message}`);
        next(unauthorized("Token is invalid or expired"));
    }
}