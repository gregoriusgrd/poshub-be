import prisma from "../../../config/prisma";
import { internalError, notFound } from "../../../core/errors/http-error";
import { EC } from "../../../core/errors/error-codes";
import { cloudinaryRemove } from "../../../core/utils/cloudinary.util";

// SOFT DELETE PRODUCT
export const deleteProductService = async (id: number) => {
  const product = await prisma.product.findFirst({
    where: { id, isDeleted: false },
  });

  if (!product) throw notFound("Product not found", EC.NOT_FOUND);

  try {
    // Hapus gambar dari Cloudinary jika ada
    if (product.imageUrl) {
      await cloudinaryRemove(product.imageUrl);
    }
  } catch (err) {
    throw internalError("Failed to remove product image from Cloudinary", EC.INTERNAL_SERVER_ERROR, err);
  }

  await prisma.product.update({
    where: { id },
    data: { isDeleted: true },
  });

  return { message: "Product soft deleted successfully" };
};
