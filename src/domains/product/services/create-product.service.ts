import prisma from "../../../config/prisma";
import { badRequest, internalError } from "../../../core/errors/http-error";
import { EC } from "../../../core/errors/error-codes";
import { CreateProductDTO } from "../dto/create-product.dto";
import { cloudinaryUpload } from "../../../core/utils/cloudinary.util";

// CREATE PRODUCT
export const createProductService = async (
  data: CreateProductDTO,
  files?: Express.Multer.File[]
) => {
  const { name, price, stock, categoryId } = data;

  // --- VALIDASI FILE ---
  if (files && files.length > 5) {
    throw badRequest("Maximum 5 images allowed", EC.BAD_REQUEST);
  }

  // --- UPLOAD GAMBAR KE CLOUDINARY ---
  let uploadedImages: string[] = [];
  if (files && files.length > 0) {
    try {
      const uploadResults = await Promise.all(
        files.map((file) => cloudinaryUpload(file, undefined, "products"))
      );
      uploadedImages = uploadResults.map((res) => res.secure_url);
    } catch (error) {
      throw internalError(
        "Failed to upload product images",
        EC.INTERNAL_SERVER_ERROR,
        error
      );
    }
  }

  // --- CREATE PRODUCT DALAM TRANSAKSI ---
  const newProduct = await prisma.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: {
        name,
        price,
        stock,
        categoryId,
      },
    });

    if (uploadedImages.length > 0) {
      await tx.productImage.createMany({
        data: uploadedImages.map((url) => ({
          productId: product.id,
          url,
        })),
      });
    }

    const fullProduct = await tx.product.findUnique({
      where: { id: product.id },
      include: { category: true, images: true },
    });

    return fullProduct!;
  });

  return newProduct;
};