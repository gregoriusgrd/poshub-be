import prisma from "../../../config/prisma";
import { badRequest, internalError } from "../../../core/errors/http-error";
import { EC } from "../../../core/errors/error-codes";
import { CreateProductDTO } from "../dto/product.dto";
import { cloudinaryUpload } from "../../../core/utils/cloudinary.util";

// CREATE PRODUCT
export const createProductService = async (
  data: CreateProductDTO,
  file?: Express.Multer.File // hanya 1 file
) => {
  const { name, price, stock, categoryId } = data;

  // validasi input
  if (!file) {
    throw badRequest("Product image is required", EC.BAD_REQUEST);
  }

  // upload image ke Cloudinary
  let uploadedUrl: string | null = null;
    try {
      const uploadResult = await cloudinaryUpload(file, "products");
      uploadedUrl = uploadResult.secure_url;
    } catch (error) {
      throw internalError(
        "Failed to upload product image",
        EC.INTERNAL_SERVER_ERROR,
        error
      );
  }

  const newProduct = await prisma.product.create({
    data: {
      name,
      price,
      stock,
      categoryId,
      imageUrl: uploadedUrl,
    },
    include: { category: true }
  });

  return newProduct;
};