/*

import { Request, Response, NextFunction } from "express";
import { createProductSchema, productIdSchema, updateProductSchema } from "../validations/product.validations";
import { createProductService, deleteProductService, getAllProductsService, getProductByIdService, updateProductService } from "../services/product.service";
import { badRequest } from "../../../core/errors/http-error";
import { EC } from "../../../core/errors/error-codes";



export const createProductController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createProductSchema.parse(req.body);
    const files = req.files as Express.Multer.File[] | undefined;

    if (files && files.length > 5) {
        throw badRequest("Maximum 5 images allowed", EC.BAD_REQUEST);
    }

    const newProduct = await createProductService(data, files);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (err) {
    next(err);
  }
};

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

export const getProductByIdController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = productIdSchema.parse(req.params);
        const product = await getProductByIdService(id);

        return res.json({
            success: true,
            message: "Product retrieved successfully",
            data: product,
        })
    } catch (err) {
        next(err);
    }
}

export const updateProductController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = productIdSchema.parse(req.params);
        const data = updateProductSchema.parse(req.body);
        const files = req.files as Express.Multer.File[] | undefined;

        if (files && files.length > 5) {
            throw badRequest("Maximum 5 images allowed", EC.BAD_REQUEST);
        }

        const updatedProduct = await updateProductService(id, data, files);

        return res.json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct,
        })
    } catch (err) {
        next(err);
    }
}

export const deleteProductController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = productIdSchema.parse(req.params);
        const result = await deleteProductService(id);

        return res.json({
            success: true,
            message: result.message,
        });
    } catch (err) {
        next(err);
    }
}

*/