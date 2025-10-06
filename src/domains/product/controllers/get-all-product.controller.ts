import { Request, Response, NextFunction } from "express";
import { getAllProductsService } from "../services/get-all-product.service";

export const getAllProductsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pagination = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,
            search: req.query.search?.toString(),
            categoryId: req.query.categoryId ? Number(req.query.categoryId) : undefined,
            sortBy: req.query.sortBy as "name" | "price" | "createdAt" | undefined,
            order: req.query.sortOrder as "asc" | "desc" | undefined,
        };

        const products = await getAllProductsService(pagination);

        return res.status(200).json({
            success: true,
            message: "Products retrieved successfully",
            ...products,
        })
    } catch (err) {
        next(err);
    }
}