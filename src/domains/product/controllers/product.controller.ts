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
        const { page, limit, search, categoryId, sortBy, sortOrder } = req.query;

        const products = await getAllProductsService({
            page: page ?  Number(page) : 1,
            limit: limit ? Number(limit) : 10,
            search: search ? String(search) : undefined,
            categoryId: categoryId ? Number(categoryId) : undefined,
            sortBy: sortBy ? (sortBy as "name" | "price" | "createdAt") : undefined,
            order: sortOrder ? (sortOrder as "asc" | "desc") : undefined,
        });

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

        const updatedProduct = await updateProductService(id, data);

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