export type HttpErrorShape = Error & {
  statusCode: number;
  code?: string;     // optional: bisa diisi error code enum
  details?: unknown; // optional: untuk tambahan info
};

/**
 * Factory function untuk membuat HttpError object.
 */
export function HttpError(
  statusCode: number,
  message: string,
  code?: string,
  details?: unknown
): HttpErrorShape {
  const err = new Error(message) as HttpErrorShape;
  err.name = "HttpError";
  err.statusCode = statusCode;
  err.code = code;
  err.details = details;
  return err;
}

// Helper shortcuts sesuai HTTP status umum

export const badRequest = (message: string, code?: string, details?: unknown) =>
  HttpError(400, message, code, details);

export const unauthorized = (message: string, code?: string, details?: unknown) =>
  HttpError(401, message, code, details);

export const forbidden = (message: string, code?: string, details?: unknown) =>
  HttpError(403, message, code, details);

export const notFound = (message: string, code?: string, details?: unknown) =>
  HttpError(404, message, code, details);

export const conflict = (message: string, code?: string, details?: unknown) =>
  HttpError(409, message, code, details);

export const internalError = (
  message = "Internal server error",
  code?: string,
  details?: unknown
) => HttpError(500, message, code, details);
