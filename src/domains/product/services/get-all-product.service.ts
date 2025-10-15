import prisma from "../../../config/prisma";
import { getPagination } from "../../../core/utils/pagination.util";
import { Prisma } from "@prisma/client";

// GET ALL PRODUCTS (with pagination, search, filter, sort)
export const getAllProductsService = async (query: {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  sortBy?: "name" | "price" | "createdAt";
  order?: "asc" | "desc";
}) => {
  const { skip, take, page, limit } = getPagination(query);
  const { search, categoryId, sortBy = "createdAt", order = "desc" } = query;

  // 🧠 Build filter "where"
  const where: Prisma.ProductWhereInput = {
    isDeleted: false,
    ...(search
      ? {
          name: {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
          },
        }
      : {}),
    ...(categoryId ? { categoryId } : {}),
  };

  // 🧾 Fetch products + count in parallel
  const [data, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      skip,
      take,
      orderBy: { [sortBy]: order },
    }),
    prisma.product.count({ where }),
  ]);

  // 🎯 Return result with pagination metadata
  return {
    data,
    meta: {
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit,
    },
  };
};
