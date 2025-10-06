import prisma from "../../../config/prisma";
import { notFound } from "../../../core/errors/http-error";
import { EC } from "../../../core/errors/error-codes";

// SOFT DELETE PRODUCT
export const deleteProductService = async (id: number) => {
  const product = await prisma.product.findFirst({
    where: { id, isDeleted: false },
  });
  if (!product) throw notFound("Product not found", EC.NOT_FOUND);

  await prisma.product.update({
    where: { id },
    data: { isDeleted: true },
  });

  return { message: "Product soft deleted successfully" };
};
