import prisma from "../../../config/prisma";
import { CreateProductDTO } from "../dto/create-product.dto";
import { UpdateProductDTO } from "../dto/update-product.dto";

export const createProduct = async (data: CreateProductDTO) => {
    const { images, ...productData } = data;
    return prisma.product.create({
        data: {
            ...productData,
            images: images ? { create: images.map(url => ({ url })) } : undefined,
        },
        include: { category: true, images: true },
    });
};

export const getAllProducts = async () => {
    return prisma.product.findMany({
        include: { category: true, images: true },
        orderBy: { createdAt: 'desc' },
    });
};

export const getProductById = async (id: number) => {
    return prisma.product.findUnique({
        where: { id },
        include: { category: true, images: true },
    });
};

export const updateProduct = async (id: number, data: UpdateProductDTO) => {
    const { images, ...productData } = data;

    return prisma.product.update({
        where: { id },
        data: {
            ...productData,
            ...(images ? {
                images: {
                    deleteMany: {},
                    create: images.map((url) => ({ url})),
                }
            }
            : {}),
        },
        include: { category: true, images: true },
    });
};

export const deleteProduct = async (id: number) => {
    return prisma.product.delete({
        where: { id }
    });
};