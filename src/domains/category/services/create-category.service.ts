import { createCategory, getCategoryByName } from "../repositories/category.repository";
import { CreateCategoryInput } from "../validations/category.validation";
import { badRequest } from "../../../core/errors/http-error";

export const createCategoryService = async (data: CreateCategoryInput) => {
  const existing = await getCategoryByName(data.name);
  if (existing) throw badRequest("Category name already exists");

  const category = await createCategory(data);
  return category;
};
