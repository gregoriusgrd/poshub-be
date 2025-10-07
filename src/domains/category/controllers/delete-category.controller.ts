import { Request, Response, NextFunction } from "express";
import { categoryIdSchema } from "../validations/category.validation";
import { deleteCategoryService } from "../services/delete-category.service";

// DELETE CATEGORY
export const deleteCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = categoryIdSchema.parse(req.params);

    const result = await deleteCategoryService(id);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
};
