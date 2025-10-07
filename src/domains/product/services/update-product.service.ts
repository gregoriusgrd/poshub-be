import prisma from "../../../config/prisma";
import { notFound, internalError } from "../../../core/errors/http-error";
import { EC } from "../../../core/errors/error-codes";
import { UpdateProductDTO } from "../dto/product.dto";
import { cloudinaryUpload, cloudinaryRemove } from "../../../core/utils/cloudinary.util";

// UPDATE PRODUCT
export const updateProductService = async (
  id: number,
  data: UpdateProductDTO,
  file?: Express.Multer.File // hanya 1 file
) => {
  // Cari product
  const product = await prisma.product.findFirst({
    where: { id, isDeleted: false },
  });

  if (!product) throw notFound("Product not found", EC.NOT_FOUND);

  let newImageUrl: string | null = null;

  // handle file upload
  if (file) {
    try {
      // Hapus gambar lama dari Cloudinary jika ada
      if (product.imageUrl) {
        await cloudinaryRemove(product.imageUrl);
      }

      // Upload gambar baru
      const uploadResult = await cloudinaryUpload(file, "products");
      newImageUrl = uploadResult.secure_url;
    } catch (error) {
      throw internalError("Failed to update product image", EC.INTERNAL_SERVER_ERROR, error);
    }
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: {
      ...data,
      ...(newImageUrl && { imageUrl: newImageUrl }),
    },
    include: { category: true },
  });

  return updatedProduct;
};
