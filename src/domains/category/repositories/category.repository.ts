import prisma from "../../../config/prisma";
import { CreateCategoryDTO, UpdateCategoryDTO } from "../dto/category.dto";

export const createCategory = async (data: CreateCategoryDTO) => {
  return prisma.category.create({ data });
};

export const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const getCategoryById = async (id: number) => {
  return prisma.category.findUnique({
    where: { id },
  });
};

export const getCategoryByName = async (name: string) => {
  return prisma.category.findUnique({
    where: { name },
  });
};

export const updateCategory = async (id: number, data: UpdateCategoryDTO) => {
  return prisma.category.update({
    where: { id },
    data,
  });
};

export const deleteCategory = async (id: number) => {
  return prisma.category.delete({
    where: { id },
  });
};
