import { getCategoryById, getCategoryByName, updateCategory } from "../repositories/category.repository";
import { UpdateCategoryInput } from "../validations/category.validation";
import { badRequest, notFound } from "../../../core/errors/http-error";

export const updateCategoryService = async (id: number, data: UpdateCategoryInput) => {
  const existing = await getCategoryById(id);
  if (!existing) throw notFound("Category not found");

  if (data.name && data.name !== existing.name) {
    const duplicate = await getCategoryByName(data.name);
    if (duplicate) throw badRequest("Category name already exists");
  }

  const updated = await updateCategory(id, data);
  return updated;
};
