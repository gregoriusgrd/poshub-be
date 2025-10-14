import { format } from "date-fns";

/**
 * Generate unique, readable transaction code.
 * Format: TRX-YYYYMMDD-RR
 * Example: TRX-20251014-AB
 */

export function generateTransactionCode(): string {
  const datePart = format(new Date(), "yyyyMMdd");
  const randomPart = Math.random().toString(36).substring(2, 4).toUpperCase();
  return `TRX-${datePart}-${randomPart}`;
}

