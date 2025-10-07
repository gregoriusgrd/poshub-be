import prisma from "../../../config/prisma";
import { getPagination } from "../../../core/utils/pagination.util";

interface GetAllCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const getAllCategoriesService = async ({
  page,
  limit,
  search,
}: GetAllCategoriesParams) => {
  const { skip, take, page: currentPage, limit: perPage } = getPagination({
    page,
    limit,
  });

  const where = {
    ...(search && {
      name: {
        contains: search,
        mode: "insensitive" as const,
      },
    }),
  };

  const [data, total] = await Promise.all([
    prisma.category.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.count({ where }),
  ]);

  return {
    data,
    meta: {
      total,
      page: currentPage,
      limit: perPage,
      totalPages: Math.ceil(total / perPage),
    },
  };
};
