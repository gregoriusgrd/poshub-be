import prisma from "../../../config/prisma";
import { getCategoryById } from "../repositories/category.repository";
import { badRequest, notFound } from "../../../core/errors/http-error";

export const deleteCategoryService = async (id: number) => {
  const existing = await getCategoryById(id);
  if (!existing) throw notFound("Category not found");

  // Cek apakah masih ada produk aktif (belum soft-delete)
  const activeProducts = await prisma.product.findMany({
    where: { categoryId: id, isDeleted: false },
    select: { id: true, name: true },
  });

  if (activeProducts.length > 0) {
    throw badRequest(
      "Cannot delete this category because it still has active products.",
      "CATEGORY_HAS_ACTIVE_PRODUCTS"
    );
  }

  // Cek apakah produk dalam kategori ini pernah punya transaksi historis
  const productsWithTransactions = await prisma.product.findFirst({
    where: {
      categoryId: id,
      transactionItems: { some: {} },
    },
  });

  if (productsWithTransactions) {
    throw badRequest(
      "Cannot delete this category because its products have transaction records.",
      "CATEGORY_HAS_TRANSACTIONS"
    );
  }

  // Kalau aman, soft delete kategori
  await prisma.category.update({
    where: { id },
    data: { isDeleted: true },
  });

  return { message: "Category deleted successfully" };
};
