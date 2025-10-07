import prisma from "../../../config/prisma";
import { Shift } from "@prisma/client";

export interface CloseShiftPayload {
    closingBalance: number;
    closedAt?: Date;
    totalCash?: number;
    totalDebit?: number;
    totalTransactions?: number;
    cashDifference?: number;
    status?: "CLOSED" | "OPEN";
}

export const findActiveShiftByCashier = (cashierId: number) => {
    return prisma.shift.findFirst({
        where: { cashierId, status: "OPEN" },
    });
};

// Mulai shift (openingBalance di pass dari service)

export const createShift = (cashierId: number, openingBalance: number) => {
    return prisma.shift.create({
        data: { cashierId, openingBalance },
    });
};

/**
 * Tutup shift: terima payload ini (bukan hanya closingBalance)
 * service menghitung totalCash, totalDebit, totalTransactions, cashDifference
 * lalu panggil repository ini untuk update shift
 */

export const closeShift = async (shiftId: number, payload: CloseShiftPayload): Promise<Shift> => {
  const updateData: Record<string, any> = {
    closingBalance: payload.closingBalance,
    status: payload.status ?? "CLOSED",
    closedAt: payload.closedAt ?? new Date(),
  };

  if (payload.totalCash !== undefined) updateData.totalCash = payload.totalCash;
  if (payload.totalDebit !== undefined) updateData.totalDebit = payload.totalDebit;
  if (payload.totalTransactions !== undefined) updateData.totalTransactions = payload.totalTransactions;
  if (payload.cashDifference !== undefined) updateData.cashDifference = payload.cashDifference;

  return prisma.shift.update({
    where: { id: shiftId },
    data: updateData,
  });
};

export const getShiftSummary = async (shiftId: number) => {
  return prisma.shift.findUnique({
    where: { id: shiftId },
    include: {
      cashier: {
        select: { id: true, fullName: true, username: true },
      },
      transactions: {
        include: {
          transactionItems: {
            include: {
              product: {
                select: { id: true, name: true, price: true },
              },
            },
          },
        },
        orderBy: { transactionTime: "desc" },
      },
    },
  });
};