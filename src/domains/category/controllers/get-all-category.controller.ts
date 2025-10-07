import { Request, Response, NextFunction } from "express";
import { getAllCategoriesService } from "../services/get-all-category.service";

// GET ALL CATEGORIES (with pagination)
export const getAllCategoriesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search?.toString() || "";

    const categories = await getAllCategoriesService({ page, limit, search });

    return res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      ...categories,
    });
  } catch (err) {
    next(err);
  }
};