import { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod";
import { badRequest } from "../errors/http-error";

// Middleware untuk validasi request menggunakan Zod schema 

export const validateRequest = (schema: ZodObject<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params
            });
        } catch (err) {
            return next(badRequest("Invalid request data", "VALIDATION_ERROR", (err as any).errors));
        }
    }
}