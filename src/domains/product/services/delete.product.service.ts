import prisma from "../../../config/prisma";
import { badRequest, notFound, internalError } from "../../../core/errors/http-error";
import { EC } from "../../../core/errors/error-codes";
import { cloudinaryRemove } from "../../../core/utils/cloudinary.util";

/**
 * Soft delete product
 * - Tidak boleh dihapus jika masih memiliki transaksi
 * - Menghapus gambar Cloudinary jika ada
 */
export const deleteProductService = async (id: number) => {
  // Cari produk
  const product = await prisma.product.findFirst({
    where: { id, isDeleted: false },
    include: { category: true },
  });

  if (!product) throw notFound("Product not found", EC.NOT_FOUND);

  // Cek apakah produk punya transaksi
  const hasTransactions = await prisma.transactionItem.findFirst({
    where: { productId: id },
  });

  if (hasTransactions) {
    throw badRequest(
      "Cannot delete this product because it has transaction records.",
      EC.PRODUCT_HAS_TRANSACTIONS
    );
  }

  // Cek apakah kategori produk sudah dihapus (optional tapi bagus)
  if (product.category && product.category.isDeleted) {
    throw badRequest(
      "Cannot delete this product because its category is already deleted.",
      EC.CATEGORY_ALREADY_DELETED
    );
  }

  // Hapus gambar di Cloudinary (jika ada)
  try {
    if (product.imageUrl) {
      await cloudinaryRemove(product.imageUrl);
    }
  } catch (err) {
    throw internalError(
      "Failed to remove product image from Cloudinary",
      EC.INTERNAL_SERVER_ERROR,
      err
    );
  }

  // Soft delete produk
  await prisma.product.update({
    where: { id },
    data: { isDeleted: true },
  });

  return { message: "Product soft deleted successfully" };
};
