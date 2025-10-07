import { Request, Response, NextFunction } from "express";
import { categoryIdSchema } from "../validations/category.validation";
import { getCategoryByIdService } from "../services/get-id-category.service";

// GET CATEGORY BY ID
export const getCategoryByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = categoryIdSchema.parse(req.params);
    const category = await getCategoryByIdService(id);

    return res.status(200).json({
      success: true,
      message: "Category retrieved successfully",
      data: category,
    });
  } catch (err) {
    next(err);
  }
};