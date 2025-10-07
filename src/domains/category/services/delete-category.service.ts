import { getCategoryById, deleteCategory } from "../repositories/category.repository";
import { notFound } from "../../../core/errors/http-error";

export const deleteCategoryService = async (id: number) => {
  const existing = await getCategoryById(id);
  if (!existing) throw notFound("Category not found");

  await deleteCategory(id);
  return { message: "Category deleted successfully" };
};