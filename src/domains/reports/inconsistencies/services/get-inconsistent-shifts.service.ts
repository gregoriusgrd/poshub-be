import prisma from "../../../../config/prisma";
import { getPagination } from "../../../../core/utils/pagination.util";
import { sortByNumericField } from "../../../../core/utils/sort.util";

/**
 * Menampilkan shift kasir yang memiliki ketidaksesuaian saldo (inconsistencies)
 * - expectedClosing = openingBalance + totalCash
 * - difference = closingBalance - expectedClosing
 * - jika difference ≠ 0 maka shift dianggap bermasalah
 */
export const getInconsistentShiftsService = async (query: any) => {
  const {
    page = 1,
    limit = 10,
    cashierId,
    search,
    start,
    end,
    minDiff = 0,
    sortBy = "closedAt",
    order = "desc",
  } = query;

  const { skip, take } = getPagination({ page, limit });

  // Gabungkan semua filter dalam satu array AND
  const whereClause: any = {
    AND: [
      { status: "CLOSED" },
      cashierId ? { cashierId: Number(cashierId) } : {},
      start && end
        ? {
            closedAt: {
              gte: new Date(start),
              lte: new Date(end),
            },
          }
        : {},
      search
        ? {
            cashier: {
              fullName: {
                contains: search,
                mode: "insensitive",
              },
            },
          }
        : {},
    ],
  };

  // Ambil data dari DB
  const shifts = await prisma.shift.findMany({
    where: whereClause,
    include: {
      cashier: { select: { id: true, fullName: true, username: true } },
    },
    orderBy:
      ["closedAt", "openedAt"].includes(sortBy) && order
        ? { [sortBy]: order }
        : undefined,
  });

  // Proses perhitungan expectedClosing & difference
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

  // Sort manual kalau kolomnya bukan kolom Prisma
  if (["difference", "expectedClosing"].includes(sortBy)) {
    inconsistent = sortByNumericField(
      inconsistent,
      sortBy as keyof typeof inconsistent[0],
      order
    );
  }

  // Pagination manual
  const paginated = inconsistent.slice(skip, skip + take);

  // Final response
  return {
    data: paginated,
    meta: {
      page: Number(page),
      limit: Number(limit),
      totalItems: inconsistent.length,
      totalPages: Math.ceil(inconsistent.length / limit),
    },
  };
};
