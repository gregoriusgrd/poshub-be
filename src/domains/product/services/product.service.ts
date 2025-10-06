import prisma from "../../../config/prisma";
import { getPagination } from "../../../core/utils/pagination.util";
import { badRequest, notFound, internalError } from "../../../core/errors/http-error";
import { EC } from "../../../core/errors/error-codes";
import { CreateProductDTO } from "../dto/create-product.dto";
import { UpdateProductDTO } from "../dto/update-product.dto";
import { Prisma } from "@prisma/client";
import { cloudinaryUpload, cloudinaryRemove } from "../../../core/utils/cloudinary.util";

/*

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

// GET ALL PRODUCTS (with pagination, search, filter, sort)
export const getAllProductsService = async (query: {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  sortBy?: "name" | "price" | "createdAt";
  order?: "asc" | "desc";
}) => {
  const { skip, take, page, limit } = getPagination(query);
  const { search, categoryId, sortBy = "createdAt", order = "desc" } = query;

  const where: Prisma.ProductWhereInput = {
    isDeleted: false,
    ...(search && { name: { contains: search, mode: "insensitive" } }),
    ...(categoryId && { categoryId }),
  };

  const [data, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true, images: true },
      skip,
      take,
      orderBy: { [sortBy]: order },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit,
    },
  };
};

// GET PRODUCT BY ID
export const getProductByIdService = async (id: number) => {
  const product = await prisma.product.findFirst({
    where: { id, isDeleted: false },
    include: { category: true, images: true },
  });

  if (!product) throw notFound("Product not found", EC.NOT_FOUND);
  return product;
};

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

*/