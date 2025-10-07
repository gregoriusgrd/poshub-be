import { getCategoryById } from "../repositories/category.repository";
import { notFound } from "../../../core/errors/http-error";

export const getCategoryByIdService = async (id: number) => {
  const category = await getCategoryById(id);
  if (!category) throw notFound("Category not found");

  return category;
};
