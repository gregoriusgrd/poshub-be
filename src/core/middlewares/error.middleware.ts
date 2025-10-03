import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { isHttpError } from "../errors/http-error";

// Middleware untuk route yang tidak ditemukan
export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    code: "ROUTE_NOT_FOUND",
  });
};

// Middleware utama error handler
export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  console.error(`[${req.method} ${req.url}]`, err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Invalid input",
      code: "VALIDATION_ERROR",
      errors: err.flatten(),
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Unique constraint violation",
        code: "UNIQUE_CONSTRAINT",
      });
    }
    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Record not found",
        code: "RECORD_NOT_FOUND",
      });
    }
  }

  if (isHttpError(err)) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
      errors: err.details,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
    code: "INTERNAL_SERVER_ERROR",
  });
};
