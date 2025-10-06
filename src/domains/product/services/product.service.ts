import prisma from "../../../config/prisma";
import { getPagination } from "../../../core/utils/pagination.util";
import { badRequest, conflict, notFound } from "../../../core/errors/http-error";
import { EC } from "../../../core/errors/error-codes";
import { CreateProductDTO } from "../dto/create-product.dto";
import { UpdateProductDTO } from "../dto/update-product.dto";
import { Prisma } from "@prisma/client";

// CREATE PRODUCT
export const createProductService = async (data: CreateProductDTO) => {
  const existing = await prisma.product.findFirst({
    where: {
      name: data.name,
      isDeleted: false,
    },
  });

  if (existing) throw conflict("Product name already exists", EC.CONFLICT);

  const { images, ...productData } = data;

  const newProduct = await prisma.product.create({
    data: {
      ...productData,
      images: images ? { create: images.map((url) => ({ url })) } : undefined,
    },
    include: { category: true, images: true },
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
export const updateProductService = async (id: number, data: UpdateProductDTO) => {
  const product = await prisma.product.findFirst({
    where: { id, isDeleted: false },
  });
  if (!product) throw notFound("Product not found", EC.NOT_FOUND);

  const { images, ...productData } = data;

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: {
      ...productData,
      ...(images && {
        images: {
          deleteMany: {}, // hapus semua gambar lama
          create: images.map((url) => ({ url })),
        },
      }),
    },
    include: { category: true, images: true },
  });

  return updatedProduct;
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
