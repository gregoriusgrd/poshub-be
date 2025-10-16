import prisma from "../../../config/prisma";
import { getPagination } from "../../../core/utils/pagination.util";

/**
 * Menampilkan ringkasan shift kasir dalam periode tertentu
 */

export const getShiftSalesService = async (query: any) => {
  const { start, end, cashierId, status, sortBy = "openedAt", order = "desc" } = query;

  // Date filter
  const dateFilter: any = {};
  if (start || end) {
    dateFilter.openedAt = {};
    if (start) dateFilter.openedAt.gte = new Date(start);
    if (end) dateFilter.openedAt.lte = new Date(end);
  }

  // Pagination
  const { page, limit, skip, take } = getPagination({
    page: Number(query.page),
    limit: Number(query.limit),
  });

  // Where clause
  const whereClause: any = { ...dateFilter };
  if (cashierId) whereClause.cashierId = Number(cashierId);
  if (status) whereClause.status = status;

  // Query shifts
  const [shifts, total] = await Promise.all([
    prisma.shift.findMany({
      where: whereClause,
      include: {
        cashier: { select: { id: true, fullName: true, username: true } },
      },
      orderBy: { [sortBy]: order },
      skip,
      take,
    }),
    prisma.shift.count({ where: whereClause }),
  ]);

  // Mapping hasil akhir
  const report = shifts.map((s) => ({
    id: s.id,
    cashier: s.cashier.fullName,
    cashierId: s.cashierId,
    openedAt: s.openedAt,
    closedAt: s.closedAt,
    openingBalance: Number(s.openingBalance),
    closingBalance: s.closingBalance ? Number(s.closingBalance) : null,
    totalTransactions: s.totalTransactions || 0,
    totalCash: s.totalCash ? Number(s.totalCash) : 0,
    totalDebit: s.totalDebit ? Number(s.totalDebit) : 0,
    cashDifference: s.cashDifference ? Number(s.cashDifference) : 0,
    status: s.status,
  }));

  // Final response
  return {
    data: report,
    meta: {
      page,
      limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
