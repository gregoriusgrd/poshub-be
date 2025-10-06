import prisma from "../../../config/prisma";
import { notFound } from "../../../core/errors/http-error";
import { EC } from "../../../core/errors/error-codes";

// GET PRODUCT BY ID
export const getProductByIdService = async (id: number) => {
  const product = await prisma.product.findFirst({
    where: { id, isDeleted: false },
    include: { category: true, images: true },
  });

  if (!product) throw notFound("Product not found", EC.NOT_FOUND);
  return product;
};