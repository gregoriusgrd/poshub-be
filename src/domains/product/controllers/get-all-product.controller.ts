import { Request, Response, NextFunction } from "express";
import { getAllProductsService } from "../services/get-all-product.service";

export const getAllProductsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search?.toString();
        const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;

        const sortBy =
            req.query.sortBy === "name" ||
            req.query.sortBy === "price" ||
            req.query.sortBy === "createdAt"
                ? req.query.sortBy
                : "createdAt";
        
        const order = req.query.order === "asc" || req.query.order === "desc" ? req.query.order : "desc";

        const products = await getAllProductsService({ page, limit, search, categoryId, sortBy, order });

        return res.status(200).json({
            success: true,
            message: "Products retrieved successfully",
            ...products,
        })
    } catch (err) {
        next(err);
    }
}