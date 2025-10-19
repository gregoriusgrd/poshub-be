import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import multer from "multer";
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

  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Invalid input",
      code: "VALIDATION_ERROR",
      errors: err.flatten(),
    });
  }

  // Prisma known errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const target = Array.isArray(err.meta?.target)
        ? (err.meta?.target as string[]).join(", ")
        : "field";

      const message =
        target === "username"
          ? "Username already exists."
          : `Duplicate value for ${target}.`;

      return res.status(409).json({
        success: false,
        message,
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

    if (err.code === "P2003") {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete this record because it is still referenced by another resource.",
        code: "FOREIGN_KEY_CONSTRAINT",
        meta: err.meta,
      });
    }
  }

  // Multer error: File too large
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large. Maximum allowed size is 1MB.",
        code: "LIMIT_FILE_SIZE",
      });
    }

    // other Multer errors (like fieldname mismatch)
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`,
      code: "UPLOAD_ERROR",
    });
  }

  // Custom fileFilter error from uploader.util
  if (err.message?.includes("Invalid file type")) {
    return res.status(400).json({
      success: false,
      message: "Invalid file type. Only images are allowed.",
      code: "INVALID_FILE_TYPE",
    });
  }

  // Custom HTTP error
  if (isHttpError(err)) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
      errors: err.details,
    });
  }

  // Default (catch all)
  return res.status(500).json({
    success: false,
    message: "Internal server error",
    code: "INTERNAL_SERVER_ERROR",
  });
};
