import prisma from "../../../config/prisma";
import { startOfDay, endOfDay, subDays } from "date-fns";

/**
 * Dashboard Summary Service
 */
export const getDashboardSummaryService = async () => {
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  const [
    totalSalesToday,
    totalTransactionsToday,
    activeCashiers,
    inconsistentShifts,
  ] = await Promise.all([
    prisma.transaction.aggregate({
      _sum: { totalAmount: true },
      where: { transactionTime: { gte: todayStart, lte: todayEnd } },
    }),
    prisma.transaction.count({
      where: { transactionTime: { gte: todayStart, lte: todayEnd } },
    }),
    prisma.shift.count({ where: { status: "OPEN" } }),
    prisma.shift.count({
      where: {
        cashDifference: { not: 0 },
        openedAt: { gte: todayStart, lte: todayEnd },
      },
    }),
  ]);

  // Daily Sales Trend (7 hari terakhir)
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const dayStart = startOfDay(subDays(new Date(), i));
    const dayEnd = endOfDay(subDays(new Date(), i));

    const sum = await prisma.transaction.aggregate({
      _sum: { totalAmount: true },
      where: { transactionTime: { gte: dayStart, lte: dayEnd } },
    });

    last7Days.push({
      date: dayStart.toISOString().split("T")[0],
      totalSales: Number(sum._sum.totalAmount || 0),
    });
  }

  // Top 5 Products Sold (7 hari terakhir)
  const topProducts = await prisma.transactionItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true },
    where: {
      transaction: {
        transactionTime: { gte: subDays(todayStart, 7), lte: todayEnd },
      },
    },
    orderBy: { _sum: { quantity: "desc" } },
    take: 5,
  });

  const productDetails = await prisma.product.findMany({
    where: { id: { in: topProducts.map((p) => p.productId) } },
    select: { id: true, name: true },
  });

  const topProductsData = topProducts.map((p) => ({
    productId: p.productId,
    productName:
      productDetails.find((d) => d.id === p.productId)?.name || "Unknown",
    totalSold: Number(p._sum.quantity || 0),
  }));

  return {
    totalSalesToday: Number(totalSalesToday._sum.totalAmount || 0),
    totalTransactionsToday,
    activeCashiers,
    inconsistentShifts,
    salesTrend: last7Days,
    topProducts: topProductsData,
  };
};
