import { Request, Response, NextFunction } from "express";
import { ZodError, ZodTypeAny } from "zod";
import { badRequest } from "../errors/http-error";

// Middleware untuk validasi request menggunakan Zod schema

export const validateRequest = (schema: ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      }); // Validasi body request
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return next(badRequest("Invalid request data", "VALIDATION_ERROR", err.flatten()));
      }
      next(err);
    }
  };
};
