export interface PaginationOptions {
  page?: number; // halaman ke berapa
  limit?: number; // jumlah item per halaman
  maxLimit?: number; // batas maksimum item per halaman
}

export interface PaginationResult {
  skip: number;
  take: number;
  page: number; // untuk Prisma offset
  limit: number; // untuk Prisma limit
}

export const getPagination = (
  options: PaginationOptions = {},
  defaultLimit = 10,
  maxLimit = 100
): PaginationResult => {
  const page = options.page && options.page > 0 ? options.page : 1;

  // limit tidak boleh lebih dari maxLimit
  const limit =
    options.limit && options.limit > 0
      ? Math.min(options.limit, maxLimit)
      : defaultLimit;

  const skip = (page - 1) * limit;
  const take = limit;

  return { page, limit, skip, take };
};
