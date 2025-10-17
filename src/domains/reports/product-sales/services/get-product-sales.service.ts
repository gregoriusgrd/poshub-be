import prisma from "../../../../config/prisma";
import { getPagination } from "../../../../core/utils/pagination.util";

/**
 * Menampilkan total penjualan produk per hari dalam periode tertentu
 */

export const getProductSalesService = async (query: any) => {
  const { start, end, categoryId, paymentMethod, search, sortBy = "totalRevenue", order = "desc"} = query;

  // Date range filter (optional)
  const dateFilter: any = {};
  if (start || end) {
    dateFilter.transactionTime = {};
    if (start) dateFilter.transactionTime.gte = new Date(start);
    if (end) dateFilter.transactionTime.lte = new Date(end);
  }

  // Pagination setup
  const { page, limit, skip, take } = getPagination({
    page: Number(query.page),
    limit: Number(query.limit),
  });

  // Transaction filters
  const whereClause: any = { ...dateFilter };
  if (paymentMethod) whereClause.paymentMethod = paymentMethod;

  // Ambil transaksi lengkap dengan items dan product
  const transactions = await prisma.transaction.findMany({
    where: whereClause,
    include: {
      transactionItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              categoryId: true,
              category: { select: { name: true } },
            },
          },
        },
      },
    },
  });

  // Group by product
  const productMap: Record<
    number,
    {
      id: number;
      name: string;
      price: number;
      categoryId: number;
      category?: string;
      totalSold: number;
      totalRevenue: number;
    }
  > = {};

  for (const trx of transactions) {
    for (const item of trx.transactionItems) {
      const product = item.product;
      if (!productMap[product.id]) {
        productMap[product.id] = {
          id: product.id,
          name: product.name,
          price: product.price,
          categoryId: product.categoryId,
          category: product.category?.name,
          totalSold: 0,
          totalRevenue: 0,
        };
      }

      productMap[product.id].totalSold += item.quantity;
      productMap[product.id].totalRevenue += Number(item.subtotal);
    }
  }

  // convert to array
  let report = Object.values(productMap);

  // Filter kategori & search
  if (categoryId) {
    report = report.filter((p) => p.categoryId === Number(categoryId));
  }

  if (search) {
    const lowerSearch = search.toLowerCase();
    report = report.filter((p) => p.name.toLowerCase().includes(lowerSearch));
  }

  // Sorting
  type SortableField = "name" | "price" | "totalSold" | "totalRevenue";
  const sortField = (sortBy as SortableField) || "totalRevenue";
  const sortOrder: "asc" | "desc" = order === "asc" ? "asc" : "desc";

  const sorted = report.sort((a, b) => {
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