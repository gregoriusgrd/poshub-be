import prisma from "../../../config/prisma";
import { getPagination } from "../../../core/utils/pagination.util";
import { sortByNumericField } from "../../../core/utils/sort.util";

/**
 * Menampilkan shift kasir yang memiliki ketidaksesuaian data
 * expectedClosing = openingBalance + totalCash
 * difference = closingBalance - expectedClosing
 * jika difference !== 0, maka shift tersebut bermasalah
 */

export const getInconsistentShiftsService = async (query: any) => {
  const { page = 1, limit = 10, cashierId, start, end, minDiff = 0, sortBy = "closedAt", order = "desc" } = query;
  const { skip, take } = getPagination({ page, limit });

  // Ambil semua shift yang sudah CLOSED + filter
  const shifts = await prisma.shift.findMany({
    where: {
      status: "CLOSED",
      ...(cashierId ? { cashierId: Number(cashierId) } : {}),
      ...(start && end
        ? {
            closedAt: {
              gte: new Date(start),
              lte: new Date(end),
            },
          }
        : {}),
    },
    include: {
      cashier: { select: { id: true, fullName: true, username: true } },
    },
    // hanya sort di Prisma kalau kolomnya valid
    orderBy:
      ["closedAt", "openedAt"].includes(sortBy) && order
        ? { [sortBy]: order }
        : undefined,
  });

  // Hitung expected dan difference
  let inconsistent = shifts
    .map((s) => {
      const opening = Number(s.openingBalance || 0);
      const closing = Number(s.closingBalance || 0);
      const totalCash = Number(s.totalCash || 0);
      const totalDebit = Number(s.totalDebit || 0);

      const expectedClosing = opening + totalCash;
      const difference = closing - expectedClosing;

      return {
        id: s.id,
        cashierId: s.cashierId,
        cashierName: s.cashier.fullName,
        openedAt: s.openedAt,
        closedAt: s.closedAt,
        openingBalance: opening,
        closingBalance: closing,
        totalCash,
        totalDebit,
        expectedClosing,
        difference,
        status: s.status,
      };
    })
    .filter((shift) => Math.abs(shift.difference) > Number(minDiff));

    // Sort manual kalau sortBy = difference / expectedClosing
    if (["difference", "expectedClosing"].includes(sortBy)) {
        inconsistent = sortByNumericField(inconsistent, sortBy as keyof typeof inconsistent[0], order);
    }

  // Pagination manual
  const paginated = inconsistent.slice(skip, skip + take);

  return {
    data: paginated,
    meta: {
      page,
      limit,
      totalItems: inconsistent.length,
      totalPages: Math.ceil(inconsistent.length / limit),
    },
  };
};
