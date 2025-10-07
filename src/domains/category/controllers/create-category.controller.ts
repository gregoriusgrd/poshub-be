import { Request, Response, NextFunction } from "express";
import { createCategorySchema } from "../validations/category.validation";
import { CreateCategoryDTO } from "../dto/category.dto";
import { createCategoryService } from "../services/create-category.service";

// CREATE CATEGORY
export const createCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: CreateCategoryDTO = createCategorySchema.parse(req.body);
    const newCategory = await createCategoryService(data);

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (err) {
    next(err);
  }
};