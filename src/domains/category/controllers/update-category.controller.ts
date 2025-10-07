import { Request, Response, NextFunction } from "express";
import { updateCategorySchema, categoryIdSchema } from "../validations/category.validation";
import { UpdateCategoryDTO } from "../dto/category.dto";
import { updateCategoryService } from "../services/update-category.service";

// UPDATE CATEGORY
export const updateCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = categoryIdSchema.parse(req.params);
    const data: UpdateCategoryDTO = updateCategorySchema.parse(req.body);

    const updatedCategory = await updateCategoryService(id, data);

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (err) {
    next(err);
  }
};