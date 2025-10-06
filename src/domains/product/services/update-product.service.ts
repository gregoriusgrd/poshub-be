import prisma from "../../../config/prisma";
import { notFound } from "../../../core/errors/http-error";
import { EC } from "../../../core/errors/error-codes";
import { UpdateProductDTO } from "../dto/update-product.dto";
import { cloudinaryUpload, cloudinaryRemove } from "../../../core/utils/cloudinary.util";

// UPDATE PRODUCT
export const updateProductService = async (
  id: number,
  data: UpdateProductDTO,
  files?: Express.Multer.File[]
) => {
  const product = await prisma.product.findFirst({
    where: { id, isDeleted: false },
    include: { images: true },
  });

  if (!product) throw notFound("Product not found", EC.NOT_FOUND);

  // Jalankan transaksi agar aman kalau salah satu operasi gagal
  return await prisma.$transaction(async (tx) => {
    let uploadedImages: string[] = [];

    // === HANDLE FILE UPLOAD ===
    if (files && files.length > 0) {
      // Hapus gambar lama dari Cloudinary (jika ada)
      for (const oldImage of product.images) {
        try {
          await cloudinaryRemove(oldImage.url);
        } catch (err) {
          console.warn("Failed to remove old image:", oldImage.url);
        }
      }

      // Upload gambar baru ke Cloudinary
      const uploadResults = await Promise.all(
        files.map((file) => cloudinaryUpload(file, undefined, "products"))
      );
      uploadedImages = uploadResults.map((res) => res.secure_url);

      // Hapus data image lama dari DB
      await tx.productImage.deleteMany({ where: { productId: id } });

      // Simpan data image baru
      await tx.productImage.createMany({
        data: uploadedImages.map((url) => ({
          productId: id,
          url,
        })),
      });
    }

    // === UPDATE PRODUCT DATA ===
    const { images, ...productData } = data;

    const updatedProduct = await tx.product.update({
      where: { id },
      data: {
        ...productData,
      },
      include: {
        category: true,
        images: true,
      },
    });

    return updatedProduct;
  });
};