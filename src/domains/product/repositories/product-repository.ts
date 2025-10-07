import prisma from "../../../config/prisma";
import { CreateProductDTO, UpdateProductDTO } from "../dto/product.dto";

export const createProduct = async (data: CreateProductDTO) => {
    return prisma.product.create({
        data: {
            name: data.name,
            price: data.price,
            stock: data.stock,
            categoryId: data.categoryId,
            imageUrl: data.imageUrl,
        },
        include: { category: true }
    });
};

export const getAllProducts = async () => {
    return prisma.product.findMany({
        where: { isDeleted: false },
        include: { category: true },
        orderBy: { createdAt: 'desc' },
    });
};

export const getProductById = async (id: number) => {
    return prisma.product.findUnique({
        where: { id },
        include: { category: true },
    });
};

export const updateProduct = async (id: number, data: UpdateProductDTO) => {
    return prisma.product.update({
        where: { id },
        data,
        include: { category: true },
    });
};

export const deleteProduct = async (id: number) => {
    return prisma.product.update({
        where: { id },
        data: { isDeleted: true },
    });
};