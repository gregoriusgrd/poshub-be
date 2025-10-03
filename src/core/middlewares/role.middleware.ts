import { Role } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { forbidden } from "../errors/http-error";

// Middleware untuk membatasi akses berdasarkan role

export const requireRole = (roles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;

        if (!user) {
            return next(forbidden("User not authenticated"));
        }

        if (!roles.includes(user.role)) {
            return next(forbidden("User does not have permission"));
        }

        next();
    }
}