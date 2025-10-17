import prisma from "../../../../config/prisma";
import { getPagination } from "../../../../core/utils/pagination.util";
import { startOfDay, endOfDay } from "date-fns";

/**
 * Menampilkan total transaksi dan total pendapatan (cash, debit, total) per hari dalam periode tertentu
 */

export const getDailySalesService = async (query: any) => {
  const { date, start, end, paymentMethod, search, sortBy = "date", order = "desc" } = query;

  // Tentukan range tanggal (default: hari ini)
  const startDate = date
    ? startOfDay(new Date(date))
    : start
    ? new Date(start)
    : startOfDay(new Date());
  const endDate = date
    ? endOfDay(new Date(date))
    : end
    ? new Date(end)
    : endOfDay(new Date());

  // Pagination setup
  const { page, limit, skip, take } = getPagination({
    page: Number(query.page),
    limit: Number(query.limit),
  });

  // Filter dasar
  const whereClause: any = {
    transactionTime: { gte: startDate, lte: endDate },
  };

  if (paymentMethod) {
    whereClause.paymentMethod = paymentMethod;
  }

  if (search) {
    whereClause.cashier = {
      fullName: { contains: search, mode: "insensitive" },
    };
  }

  // Ambil semua transaksi dalam range
  const transactions = await prisma.transaction.findMany({
    where: whereClause,
    select: {
      id: true,
      totalAmount: true,
      paymentMethod: true,
      transactionTime: true,
      cashier: { select: { fullName: true } },
    },
  });

  // Group by date
  const grouped: Record<
    string,
    {
      date: string;
      totalTransactions: number;
      totalRevenue: number;
      totalCash: number;
      totalDebit: number;
    }
  > = {};

  for (const trx of transactions) {
    const dateKey = trx.transactionTime.toISOString().split("T")[0];
    if (!grouped[dateKey]) {
      grouped[dateKey] = {
        date: dateKey,
        totalTransactions: 0,
        totalRevenue: 0,
        totalCash: 0,
        totalDebit: 0,
      };
    }

    grouped[dateKey].totalTransactions++;
    grouped[dateKey].totalRevenue += Number(trx.totalAmount);
    if (trx.paymentMethod === "CASH")
      grouped[dateKey].totalCash += Number(trx.totalAmount);
    else if (trx.paymentMethod === "DEBIT_CARD")
      grouped[dateKey].totalDebit += Number(trx.totalAmount);
  }

  const reportArray = Object.values(grouped);

  // Sort util reusable
  type SortableField =
    | "date"
    | "totalTransactions"
    | "totalRevenue"
    | "totalCash"
    | "totalDebit";

  const sortField = (sortBy as SortableField) || "date";
  const sortOrder: "asc" | "desc" = order === "asc" ? "asc" : "desc";

  const sorted = reportArray.sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (valA === valB) return 0;
    return sortOrder === "asc" ? (valA > valB ? 1 : -1) : valA < valB ? 1 : -1;
  });

  // Pagination hasil akhir
  const paginated = sorted.slice(skip, skip + take);

  return {
    data: paginated,
    meta: {
      page,
      limit,
      totalItems: sorted.length,
      totalPages: Math.ceil(sorted.length / limit),
    },
  };
};